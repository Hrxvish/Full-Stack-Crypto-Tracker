const express = require('express');
const router = express.Router();
const { getCoins, postHistory } = require('../controllers/coinController');

// GET /api/coins
router.get('/coins', getCoins);

// POST /api/history
router.post('/history', postHistory);

module.exports = router;
