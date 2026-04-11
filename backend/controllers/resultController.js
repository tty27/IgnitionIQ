const db = require('../config/database');

exports.saveResult = async (req, res) => {
  try {
    const { category, score, totalQuestions, timeTaken } = req.body;
    const userId = req.user.userId;

    if (!category || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [categories] = await db.query(
      'SELECT id FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

    const [result] = await db.query(
      'INSERT INTO user_quiz_results (user_id, category_id, score, total_questions, time_taken) VALUES (?, ?, ?, ?, ?)',
      [userId, categoryId, score, totalQuestions, timeTaken]
    );

    res.status(201).json({
      message: 'Result saved successfully',
      resultId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [results] = await db.query(`
      SELECT 
        r.id,
        r.score,
        r.total_questions,
        r.time_taken,
        r.completed_at,
        c.name as category_name,
        c.slug as category_slug
      FROM user_quiz_results r
      JOIN quiz_categories c ON r.category_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.completed_at DESC
    `, [userId]);

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [stats] = await db.query(`
      SELECT 
        c.name as category_name,
        c.slug as category_slug,
        COUNT(r.id) as total_attempts,
        AVG(r.score) as average_score,
        MAX(r.score) as best_score,
        AVG(r.time_taken) as average_time
      FROM quiz_categories c
      LEFT JOIN user_quiz_results r ON c.id = r.category_id AND r.user_id = ?
      GROUP BY c.id, c.name, c.slug
    `, [userId]);

    res.json(stats);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};