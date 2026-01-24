// backend/controllers/questionController.js
const db = require('../config/database');

// Get all questions for a specific category
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Get category ID
    const [categories] = await db.query(
      'SELECT id FROM quiz_categories WHERE slug = ?',
      [category]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryId = categories[0].id;

    // Get questions WITH EXPLANATION
    const [questions] = await db.query(
      'SELECT id, question, image_url, correct_answer, explanation FROM questions WHERE category_id = ?',
      [categoryId]
    );

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
          correct: q.correct_answer,
          explanation: q.explanation // NEW: Include explanation
        };
      })
    );

    res.json(questionsWithOptions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT id, name, slug, description FROM quiz_categories'
    );

    res.json(categories);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};