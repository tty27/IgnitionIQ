const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/auth');

router.post('/answer', authenticateToken, reviewController.saveAnswer);

router.get('/recent', authenticateToken, reviewController.getRecentAnswers);

router.get('/incorrect', authenticateToken, reviewController.getIncorrectAnswers);

router.get('/analytics', authenticateToken, reviewController.getPerformanceAnalytics);

module.exports = router;