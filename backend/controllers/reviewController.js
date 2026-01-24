const db = require('../config/database');

// Save individual answer for review
exports.saveAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer, isCorrect, timeTaken, quizResultId } = req.body;
    const userId = req.user.userId;

    await db.query(
      'INSERT INTO user_answer_history (user_id, question_id, user_answer, is_correct, time_taken, quiz_result_id) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, questionId, userAnswer, isCorrect, timeTaken, quizResultId]
    );

    res.status(201).json({ message: 'Answer saved' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get recent answered questions
exports.getRecentAnswers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;

    const [answers] = await db.query(`
      SELECT 
        h.id,
        h.user_answer,
        h.is_correct,
        h.time_taken,
        h.answered_at,
        q.id as question_id,
        q.question,
        q.correct_answer,
        q.explanation,
        q.image_url,
        c.name as category_name,
        c.slug as category_slug
      FROM user_answer_history h
      JOIN questions q ON h.question_id = q.id
      JOIN quiz_categories c ON q.category_id = c.id
      WHERE h.user_id = ?
      ORDER BY h.answered_at DESC
      LIMIT ?
    `, [userId, limit]);

    res.json(answers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get incorrect answers for review
exports.getIncorrectAnswers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.query;
    const limit = parseInt(req.query.limit) || 50;

    let query = `
      SELECT 
        h.id,
        h.user_answer,
        h.answered_at,
        q.id as question_id,
        q.question,
        q.correct_answer,
        q.explanation,
        q.image_url,
        c.name as category_name,
        c.slug as category_slug,
        COUNT(*) as times_wrong
      FROM user_answer_history h
      JOIN questions q ON h.question_id = q.id
      JOIN quiz_categories c ON q.category_id = c.id
      WHERE h.user_id = ? AND h.is_correct = FALSE
    `;

    const params = [userId];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    query += `
      GROUP BY q.id, h.user_answer, h.answered_at, c.name, c.slug
      ORDER BY times_wrong DESC, h.answered_at DESC
      LIMIT ?
    `;
    params.push(limit);

    const [answers] = await db.query(query, params);

    // Get options for each question
    const answersWithOptions = await Promise.all(
      answers.map(async (a) => {
        const [options] = await db.query(
          'SELECT option_text FROM question_options WHERE question_id = ? ORDER BY option_order',
          [a.question_id]
        );

        return {
          ...a,
          options: options.map(o => o.option_text)
        };
      })
    );

    res.json(answersWithOptions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get performance analytics
exports.getPerformanceAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Overall accuracy
    const [accuracy] = await db.query(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
        ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as accuracy_percentage
      FROM user_answer_history
      WHERE user_id = ?
    `, [userId]);

    // Category breakdown
    const [categories] = await db.query(`
      SELECT 
        c.name as category_name,
        c.slug as category_slug,
        COUNT(*) as attempts,
        SUM(CASE WHEN h.is_correct THEN 1 ELSE 0 END) as correct,
        ROUND(SUM(CASE WHEN h.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as accuracy
      FROM user_answer_history h
      JOIN questions q ON h.question_id = q.id
      JOIN quiz_categories c ON q.category_id = c.id
      WHERE h.user_id = ?
      GROUP BY c.id, c.name, c.slug
      ORDER BY accuracy DESC
    `, [userId]);

    // Most difficult questions
    const [difficult] = await db.query(`
      SELECT 
        q.id,
        q.question,
        c.name as category_name,
        COUNT(*) as attempts,
        SUM(CASE WHEN h.is_correct THEN 0 ELSE 1 END) as wrong_count
      FROM user_answer_history h
      JOIN questions q ON h.question_id = q.id
      JOIN quiz_categories c ON q.category_id = c.id
      WHERE h.user_id = ?
      GROUP BY q.id, q.question, c.name
      HAVING wrong_count > 0
      ORDER BY wrong_count DESC, attempts DESC
      LIMIT 10
    `, [userId]);

    // Recent progress (last 30 days)
    const [recentProgress] = await db.query(`
      SELECT 
        DATE(answered_at) as date,
        COUNT(*) as attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct,
        ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as daily_accuracy
      FROM user_answer_history
      WHERE user_id = ? AND answered_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(answered_at)
      ORDER BY date DESC
    `, [userId]);

    res.json({
      overall: accuracy[0],
      categories,
      difficultQuestions: difficult,
      recentProgress
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};