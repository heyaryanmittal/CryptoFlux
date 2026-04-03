const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');
const auth = require('../middleware/authMiddleware');

// Public routes for fetching data (can still keep internal auth if we want, but these are for the UI)
router.get('/coins/markets', cryptoController.getCoinsMarkets);
router.get('/exchanges', cryptoController.getExchanges);
router.get('/coins/:id', cryptoController.getCoinDetails);
router.get('/coins/:id/market_chart', cryptoController.getMarketChart);

module.exports = router;
