// backend/routes/leaderboardRoutes.js

const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authenticateToken = require('../middleware/auth');

// Get global leaderboard (public)
router.get('/global', leaderboardController.getGlobalLeaderboard);

// Get category leaderboard (public)
router.get('/category/:category', leaderboardController.getCategoryLeaderboard);

// Get user's rank (requires auth)
router.get('/my-rank', authenticateToken, leaderboardController.getUserRank);

module.exports = router;