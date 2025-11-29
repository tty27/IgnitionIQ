// backend/routes/levelRoutes.js

const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const authenticateToken = require('../middleware/auth');

// Get questions by category and level
router.get('/questions/:category', authenticateToken, levelController.getQuestionsByLevel);

// Save result with XP calculation
router.post('/results', authenticateToken, levelController.saveResultWithXP);

// Get category progress
router.get('/progress/:category', authenticateToken, levelController.getCategoryProgress);

// Get user profile with all stats
router.get('/profile', authenticateToken, levelController.getUserProfile);

module.exports = router;