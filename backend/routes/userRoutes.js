const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateWatchlist, updatePortfolio } = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.post('/watchlist', auth, updateWatchlist);
router.post('/portfolio', auth, updatePortfolio);

module.exports = router;
