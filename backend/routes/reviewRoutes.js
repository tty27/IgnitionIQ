const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/auth');

// Save individual answer
router.post('/answer', authenticateToken, reviewController.saveAnswer);

// Get recent answers
router.get('/recent', authenticateToken, reviewController.getRecentAnswers);

// Get incorrect answers for practice
router.get('/incorrect', authenticateToken, reviewController.getIncorrectAnswers);

// Get performance analytics
router.get('/analytics', authenticateToken, reviewController.getPerformanceAnalytics);

module.exports = router;