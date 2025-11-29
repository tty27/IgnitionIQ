const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authenticateToken = require('../middleware/auth');

router.get('/categories', questionController.getAllCategories);
router.get('/:category', authenticateToken, questionController.getQuestionsByCategory);

module.exports = router;