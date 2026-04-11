
const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const authenticateToken = require('../middleware/auth');
const { quizLimiter } = require('../middleware/rateLimiter');
const { validateQuizResult } = require('../middleware/validation');

router.get('/questions/mixed', authenticateToken, levelController.getMixedQuestions);

router.get('/questions/:category/:level', authenticateToken, levelController.getQuestionsByLevel);

router.get('/questions/:category', authenticateToken, levelController.getQuestionsByLevel);

router.post('/results', authenticateToken, quizLimiter, validateQuizResult, levelController.saveResultWithXP);

router.get('/progress/:category', authenticateToken, levelController.getCategoryProgress);

router.get('/profile', authenticateToken, levelController.getUserProfile);

module.exports = router;