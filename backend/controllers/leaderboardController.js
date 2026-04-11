
const db = require('../config/database');

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const [leaderboard] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.level,
        u.total_xp,
        COUNT(r.id) as total_quizzes,
        SUM(r.score) as total_correct_answers
      FROM users u
      LEFT JOIN user_quiz_results r ON u.id = r.user_id
      GROUP BY u.id, u.name, u.level, u.total_xp
      ORDER BY u.total_xp DESC, u.level DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    res.json({
      leaderboard,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCategoryLeaderboard = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    // Get category ID
    const [categories] = await db.query(
      'SELECT id, name FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;
    const categoryName = categories[0].name;

    const [leaderboard] = await db.query(`
      SELECT 
        u.id,
        u.name,
        COALESCE(p.current_level, 1) as category_level,
        COALESCE(p.xp, 0) as category_xp,
        COALESCE(p.highest_score, 0) as best_score,
        COUNT(r.id) as attempts
      FROM users u
      LEFT JOIN user_category_progress p ON u.id = p.user_id AND p.category_id = ?
      LEFT JOIN user_quiz_results r ON u.id = r.user_id AND r.category_id = ?
      GROUP BY u.id, u.name, p.current_level, p.xp, p.highest_score
      HAVING category_xp > 0 OR attempts > 0
      ORDER BY category_xp DESC, best_score DESC, attempts DESC
      LIMIT ?
    `, [categoryId, categoryId, limit]);

    res.json({
      category: categoryName,
      leaderboard
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserRank = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's rank
    const [rankResult] = await db.query(`
      SELECT COUNT(*) + 1 as rank
      FROM users
      WHERE total_xp > (SELECT total_xp FROM users WHERE id = ?)
    `, [userId]);

    const [userStats] = await db.query(`
      SELECT 
        id,
        name,
        level,
        total_xp,
        (SELECT COUNT(*) FROM user_quiz_results WHERE user_id = ?) as total_quizzes
      FROM users
      WHERE id = ?
    `, [userId, userId]);

    if (userStats.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      rank: rankResult[0].rank,
      user: userStats[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};