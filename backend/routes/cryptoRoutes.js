const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// Proxy routes for CoinGecko API
router.get('/coins/markets', cryptoController.getCoinsMarkets);
router.get('/exchanges', cryptoController.getExchanges);
router.get('/search', cryptoController.searchCoins);
router.get('/simple/price', cryptoController.getSimplePrice);
router.get('/coins/:id/market_chart', cryptoController.getMarketChart);
router.get('/coins/:id', cryptoController.getCoinDetails);

module.exports = router;
