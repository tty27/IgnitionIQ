
const db = require('../config/database');

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

function calculateCategoryLevel(categoryXp) {
  if (categoryXp < 100) return 1;
  if (categoryXp < 300) return 2;
  if (categoryXp < 600) return 3;
  if (categoryXp < 1000) return 4;
  return 5;
}

exports.getMixedQuestions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [categories] = await db.query('SELECT id FROM quiz_categories');
    
    if (categories.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }

    const categoryIds = categories.map(c => c.id);

    const placeholders = categoryIds.map(() => '?').join(',');
    const [questions] = await db.query(
      `SELECT q.id, q.question, q.image_url, q.correct_answer, q.explanation, c.name as category_name
       FROM questions q
       JOIN quiz_categories c ON q.category_id = c.id
       WHERE q.category_id IN (${placeholders})
       ORDER BY RAND()
       LIMIT 50`,
      categoryIds
    );

    if (questions.length === 0) {
      return res.json({ 
        questions: [],
        message: 'No questions available'
      });
    }

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
          correct: q.correct_answer,
          explanation: q.explanation,
          category: q.category_name
        };
      })
    );

    res.json({
      questions: questionsWithOptions
    });

  } catch (error) {
    console.error('Error in getMixedQuestions:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getQuestionsByLevel = async (req, res) => {
  try {
    const { category, level: levelParam } = req.params;
    const userId = req.user.userId;
    const [categories] = await db.query(
      'SELECT id FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

    let level;
    if (levelParam) {
      level = parseInt(levelParam);
      
      const [progress] = await db.query(
        'SELECT current_level FROM user_category_progress WHERE user_id = ? AND category_id = ?',
        [userId, categoryId]
      );
      
      const userLevel = progress.length > 0 ? progress[0].current_level : 1;
      
      if (level > userLevel) {
        return res.status(403).json({ error: 'Level not unlocked yet' });
      }
    } else {
      const [progress] = await db.query(
        'SELECT current_level FROM user_category_progress WHERE user_id = ? AND category_id = ?',
        [userId, categoryId]
      );
      
      level = progress.length > 0 ? progress[0].current_level : 1;
    }

    const [questions] = await db.query(
      'SELECT id, question, image_url, correct_answer, explanation FROM questions WHERE category_id = ? AND difficulty_level = ? ORDER BY RAND() LIMIT 10',
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
          correct: q.correct_answer,
          explanation: q.explanation
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

exports.saveResultWithXP = async (req, res) => {
  try {
    const { category, score, totalQuestions, timeTaken, level, answers } = req.body;
    const userId = req.user.userId;

    console.log('Saving result:', { category, score, totalQuestions, userId }); 

    if (!category || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quizLevel = level || 1;

    const baseXp = score * XP_PER_CORRECT_ANSWER;
    const multiplier = category === 'mixed' ? 1.5 : (XP_MULTIPLIERS[quizLevel] || 1.0);
    const xpEarned = Math.floor(baseXp * multiplier);

    const perfectBonus = (score === totalQuestions && totalQuestions > 0) ? Math.floor(xpEarned * 0.5) : 0;
    const totalXpEarned = xpEarned + perfectBonus;

    let quizResultId;

    if (category === 'mixed') {
      const [result] = await db.query(
        'INSERT INTO user_quiz_results (user_id, category_id, score, total_questions, time_taken, xp_earned, difficulty_level) VALUES (?, NULL, ?, ?, ?, ?, ?)',
        [userId, score, totalQuestions, timeTaken, totalXpEarned, 1]
      );
      quizResultId = result.insertId;
      console.log('Mixed mode result saved with ID:', quizResultId);

    } else {
      const [categories] = await db.query(
        'SELECT id FROM quiz_categories WHERE slug = ?',
        [category]
      );

      if (categories.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const categoryId = categories[0].id;

      const [result] = await db.query(
        'INSERT INTO user_quiz_results (user_id, category_id, score, total_questions, time_taken, xp_earned, difficulty_level) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, categoryId, score, totalQuestions, timeTaken, totalXpEarned, quizLevel]
      );

      quizResultId = result.insertId;

      if (answers && Array.isArray(answers)) {
        for (const answer of answers) {
          try {
            await db.query(
              'INSERT INTO user_answer_history (user_id, question_id, user_answer, is_correct, time_taken, quiz_result_id) VALUES (?, ?, ?, ?, ?, ?)',
              [
                userId,
                answer.questionId,
                answer.userAnswer,
                answer.isCorrect ? 1 : 0,
                answer.timeTaken || null,
                quizResultId
              ]
            );
          } catch (err) {
            console.error('Error saving answer history:', err);
          }
        }
      }

      const [categoryProgress] = await db.query(
        'SELECT xp, current_level, highest_score FROM user_category_progress WHERE user_id = ? AND category_id = ?',
        [userId, categoryId]
      );

      if (categoryProgress.length === 0) {
        const newCategoryLevel = calculateCategoryLevel(totalXpEarned);
        await db.query(
          'INSERT INTO user_category_progress (user_id, category_id, current_level, xp, highest_score) VALUES (?, ?, ?, ?, ?)',
          [userId, categoryId, newCategoryLevel, totalXpEarned, score]
        );
      } else {
        const newCategoryXp = categoryProgress[0].xp + totalXpEarned;
        const newCategoryLevel = calculateCategoryLevel(newCategoryXp);
        const newHighScore = Math.max(categoryProgress[0].highest_score, score);

        await db.query(
          'UPDATE user_category_progress SET xp = ?, current_level = ?, highest_score = ? WHERE user_id = ? AND category_id = ?',
          [newCategoryXp, newCategoryLevel, newHighScore, userId, categoryId]
        );
      }
    }

    await db.query(
      'UPDATE users SET total_xp = total_xp + ? WHERE id = ?',
      [totalXpEarned, userId]
    );

    const [userXp] = await db.query(
      'SELECT total_xp, level FROM users WHERE id = ?',
      [userId]
    );

    const newTotalXp = userXp[0].total_xp;
    const oldLevel = userXp[0].level;
    const newUserLevel = calculateUserLevel(newTotalXp);

    if (newUserLevel > oldLevel) {
      await db.query(
        'UPDATE users SET level = ? WHERE id = ?',
        [newUserLevel, userId]
      );
    }

    const leveledUp = newUserLevel > oldLevel;

    console.log('Result saved successfully:', { xpEarned: totalXpEarned, newUserLevel, leveledUp }); 

    res.status(201).json({
      message: 'Result saved successfully',
      xpEarned: totalXpEarned,
      perfectBonus: perfectBonus,
      newUserLevel: newUserLevel,
      leveledUp: leveledUp,
      totalXp: newTotalXp
    });

  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getCategoryProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.params;

    const [categories] = await db.query(
      'SELECT id, name FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

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


exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('Getting profile for user:', userId);

    const [users] = await db.query(
      'SELECT id, name, email, total_xp, level, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];


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

    const [quizStats] = await db.query(
      'SELECT COUNT(*) as total_quizzes, SUM(score) as total_correct FROM user_quiz_results WHERE user_id = ?',
      [userId]
    );

    const [mixedStats] = await db.query(
      `SELECT 
        COUNT(*) as total_attempts,
        MAX(score) as best_score,
        MAX(total_questions) as max_questions_answered
      FROM user_quiz_results 
      WHERE user_id = ? AND category_id IS NULL`,
      [userId]
    );

    console.log('Mixed mode stats from DB:', mixedStats[0]); 

    const nextLevelXp = XP_FOR_LEVEL[user.level + 1] || null;
    const xpToNextLevel = nextLevelXp ? nextLevelXp - user.total_xp : 0;

    const profileData = {
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
        totalQuizzes: quizStats[0].total_quizzes || 0,
        totalCorrect: quizStats[0].total_correct || 0
      },
      categories: categoryProgress,
      mixedMode: {
        attempts: mixedStats[0].total_attempts || 0,
        bestScore: mixedStats[0].best_score || 0,
        maxQuestionsAnswered: mixedStats[0].max_questions_answered || 0
      }
    };

    console.log('Returning profile data:', JSON.stringify(profileData, null, 2)); // Debug log

    res.json(profileData);

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = exports;