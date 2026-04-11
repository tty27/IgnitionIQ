
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authenticateToken = require('../middleware/auth');

router.get('/global', leaderboardController.getGlobalLeaderboard);

router.get('/category/:category', leaderboardController.getCategoryLeaderboard);

router.get('/my-rank', authenticateToken, leaderboardController.getUserRank);

module.exports = router;