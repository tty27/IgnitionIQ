// backend/controllers/levelController.js

const db = require('../config/database');

// XP calculation constants
const XP_PER_CORRECT_ANSWER = 10;
const XP_MULTIPLIERS = {
  1: 1.0,   // Beginner
  2: 1.5,   // Intermediate
  3: 2.0,   // Advanced
  4: 2.5,   // Expert
  5: 3.0    // Master
};

const XP_FOR_LEVEL = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 1500,
  7: 2500,
  8: 4000,
  9: 6000,
  10: 10000
};

// Calculate user level based on total XP
function calculateUserLevel(totalXp) {
  let level = 1;
  for (let l = 10; l >= 1; l--) {
    if (totalXp >= XP_FOR_LEVEL[l]) {
      level = l;
      break;
    }
  }
  return level;
}

// Calculate category level based on category XP
function calculateCategoryLevel(categoryXp) {
  if (categoryXp < 100) return 1;        // Beginner
  if (categoryXp < 300) return 2;        // Intermediate
  if (categoryXp < 600) return 3;        // Advanced
  if (categoryXp < 1000) return 4;       // Expert
  return 5;                               // Master
}

// Get questions by category and level
exports.getQuestionsByLevel = async (req, res) => {
  try {
    const { category, level: levelParam } = req.params;
    const userId = req.user.userId;

    // Get category ID
    const [categories] = await db.query(
      'SELECT id FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

    // If level is provided in path, use it; otherwise get user's current level
    let level;
    if (levelParam) {
      level = parseInt(levelParam);
      
      // Check if user has access to this level
      const [progress] = await db.query(
        'SELECT current_level FROM user_category_progress WHERE user_id = ? AND category_id = ?',
        [userId, categoryId]
      );
      
      const userLevel = progress.length > 0 ? progress[0].current_level : 1;
      
      if (level > userLevel) {
        return res.status(403).json({ error: 'Level not unlocked yet' });
      }
    } else {
      // Get user's current level for this category
      const [progress] = await db.query(
        'SELECT current_level FROM user_category_progress WHERE user_id = ? AND category_id = ?',
        [userId, categoryId]
      );
      
      level = progress.length > 0 ? progress[0].current_level : 1;
    }

    // Get questions for this level
    const [questions] = await db.query(
      'SELECT id, question, image_url, correct_answer FROM questions WHERE category_id = ? AND difficulty_level = ? ORDER BY RAND() LIMIT 10',
      [categoryId, level]
    );

    if (questions.length === 0) {
      return res.json({ 
        questions: [],
        currentLevel: level,
        totalLevels: 5,
        message: 'No questions available for this level'
      });
    }

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const [options] = await db.query(
          'SELECT option_text FROM question_options WHERE question_id = ? ORDER BY option_order',
          [q.id]
        );

        return {
          id: q.id,
          question: q.question,
          image: q.image_url,
          options: options.map(o => o.option_text),
          correct: q.correct_answer
        };
      })
    );

    res.json({
      questions: questionsWithOptions,
      currentLevel: parseInt(level),
      totalLevels: 5
    });

  } catch (error) {
    console.error('Error in getQuestionsByLevel:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Save result with XP calculation
exports.saveResultWithXP = async (req, res) => {
  try {
    const { category, score, totalQuestions, timeTaken, level } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!category || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get category ID
    const [categories] = await db.query(
      'SELECT id FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;
    const quizLevel = level || 1;

    // Calculate XP earned
    const baseXp = score * XP_PER_CORRECT_ANSWER;
    const multiplier = XP_MULTIPLIERS[quizLevel] || 1.0;
    const xpEarned = Math.floor(baseXp * multiplier);

    // Perfect score bonus
    const perfectBonus = (score === totalQuestions) ? Math.floor(xpEarned * 0.5) : 0;
    const totalXpEarned = xpEarned + perfectBonus;

    // Save quiz result
    const [result] = await db.query(
      'INSERT INTO user_quiz_results (user_id, category_id, score, total_questions, time_taken, xp_earned, difficulty_level) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, categoryId, score, totalQuestions, timeTaken, totalXpEarned, quizLevel]
    );

    // Update user's total XP and level
    await db.query(
      'UPDATE users SET total_xp = total_xp + ? WHERE id = ?',
      [totalXpEarned, userId]
    );

    // Get updated total XP
    const [userXp] = await db.query(
      'SELECT total_xp FROM users WHERE id = ?',
      [userId]
    );

    const newTotalXp = userXp[0].total_xp;
    const newUserLevel = calculateUserLevel(newTotalXp);

    // Update user level
    await db.query(
      'UPDATE users SET level = ? WHERE id = ?',
      [newUserLevel, userId]
    );

    // Update category progress
    const [categoryProgress] = await db.query(
      'SELECT xp, current_level, highest_score FROM user_category_progress WHERE user_id = ? AND category_id = ?',
      [userId, categoryId]
    );

    if (categoryProgress.length === 0) {
      // Create new progress entry
      const newCategoryLevel = calculateCategoryLevel(totalXpEarned);
      await db.query(
        'INSERT INTO user_category_progress (user_id, category_id, current_level, xp, highest_score) VALUES (?, ?, ?, ?, ?)',
        [userId, categoryId, newCategoryLevel, totalXpEarned, score]
      );
    } else {
      // Update existing progress
      const newCategoryXp = categoryProgress[0].xp + totalXpEarned;
      const newCategoryLevel = calculateCategoryLevel(newCategoryXp);
      const newHighScore = Math.max(categoryProgress[0].highest_score, score);

      await db.query(
        'UPDATE user_category_progress SET xp = ?, current_level = ?, highest_score = ? WHERE user_id = ? AND category_id = ?',
        [newCategoryXp, newCategoryLevel, newHighScore, userId, categoryId]
      );
    }

    // Check for level up
    const [oldUserData] = await db.query(
      'SELECT level FROM users WHERE id = ?',
      [userId]
    );
    
    const leveledUp = newUserLevel > (oldUserData[0].level || 1);

    res.status(201).json({
      message: 'Result saved successfully',
      xpEarned: totalXpEarned,
      perfectBonus: perfectBonus,
      newUserLevel: newUserLevel,
      leveledUp: leveledUp,
      totalXp: newTotalXp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's category progress
exports.getCategoryProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.params;

    // Get category ID
    const [categories] = await db.query(
      'SELECT id, name FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

    // Get progress
    const [progress] = await db.query(
      'SELECT current_level, xp, highest_score FROM user_category_progress WHERE user_id = ? AND category_id = ?',
      [userId, categoryId]
    );

    if (progress.length === 0) {
      return res.json({
        category: categories[0].name,
        currentLevel: 1,
        xp: 0,
        highestScore: 0,
        isLocked: false
      });
    }

    const currentLevel = progress[0].current_level;
    const nextLevelXp = currentLevel < 5 ? (currentLevel + 1) * 100 : null;

    res.json({
      category: categories[0].name,
      currentLevel: currentLevel,
      xp: progress[0].xp,
      highestScore: progress[0].highest_score,
      nextLevelXp: nextLevelXp,
      isMaxLevel: currentLevel >= 5
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile with stats
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user data
    const [users] = await db.query(
      'SELECT id, name, email, total_xp, level, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Get category progress
    const [categoryProgress] = await db.query(`
      SELECT 
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(p.current_level, 1) as current_level,
        COALESCE(p.xp, 0) as xp,
        COALESCE(p.highest_score, 0) as highest_score
      FROM quiz_categories c
      LEFT JOIN user_category_progress p ON c.id = p.category_id AND p.user_id = ?
    `, [userId]);

    // Get total quizzes completed
    const [quizStats] = await db.query(
      'SELECT COUNT(*) as total_quizzes, SUM(score) as total_correct FROM user_quiz_results WHERE user_id = ?',
      [userId]
    );

    // Calculate next level XP
    const nextLevelXp = XP_FOR_LEVEL[user.level + 1] || null;
    const xpToNextLevel = nextLevelXp ? nextLevelXp - user.total_xp : 0;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        totalXp: user.total_xp,
        nextLevelXp: nextLevelXp,
        xpToNextLevel: xpToNextLevel,
        memberSince: user.created_at
      },
      stats: {
        totalQuizzes: quizStats[0].total_quizzes,
        totalCorrect: quizStats[0].total_correct
      },
      categories: categoryProgress
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = exports;