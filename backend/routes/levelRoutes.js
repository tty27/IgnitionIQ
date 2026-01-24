// backend/routes/levelRoutes.js

const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const authenticateToken = require('../middleware/auth');
const { quizLimiter } = require('../middleware/rateLimiter');
const { validateQuizResult } = require('../middleware/validation');

// Get questions by category and specific level (this route must come FIRST)
router.get('/questions/:category/:level', authenticateToken, levelController.getQuestionsByLevel);

// Get questions by category (current level) - this route comes SECOND
router.get('/questions/:category', authenticateToken, levelController.getQuestionsByLevel);

// Save result with XP calculation - with rate limiting and validation
router.post('/results', authenticateToken, quizLimiter, validateQuizResult, levelController.saveResultWithXP);

// Get category progress
router.get('/progress/:category', authenticateToken, levelController.getCategoryProgress);

// Get user profile with all stats
router.get('/profile', authenticateToken, levelController.getUserProfile);

module.exports = router;