const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, resultController.saveResult);
router.get('/history', authenticateToken, resultController.getUserResults);
router.get('/stats', authenticateToken, resultController.getUserStats);

module.exports = router;