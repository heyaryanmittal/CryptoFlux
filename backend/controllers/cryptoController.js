const axios = require('axios');

// Using the keys from environment variables for security
const PRIMARY_API_KEY = process.env.PRIMARY_CG_API_KEY || '';
const BACKUP_API_KEY = process.env.BACKUP_CG_API_KEY || '';
const BASE_URL = 'https://api.coingecko.com/api/v3';

let currentApiKey = PRIMARY_API_KEY || BACKUP_API_KEY;

const cgInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-cg-demo-api-key': currentApiKey,
        'Content-Type': 'application/json',
    }
});

const rotateKey = () => {
    currentApiKey = (currentApiKey === PRIMARY_API_KEY) ? BACKUP_API_KEY : PRIMARY_API_KEY;
    cgInstance.defaults.headers['x-cg-demo-api-key'] = currentApiKey;
    return currentApiKey;
};

// Generic handler for proxying requests to CoinGecko
const proxyRequest = async (path, params = {}) => {
    try {
        const response = await cgInstance.get(path, { params });
        return response.data;
    } catch (error) {
        // If rate limited or unauthorized locally, rotate and retry once
        if (error.response && (error.response.status === 429 || error.response.status === 401)) {
            rotateKey();
            const retryRes = await cgInstance.get(path, { params });
            return retryRes.data;
        }
        throw error;
    }
};

exports.getCoinsMarkets = async (req, res) => {
    try {
        const data = await proxyRequest('/coins/markets', req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};

exports.getExchanges = async (req, res) => {
    try {
        const data = await proxyRequest('/exchanges', req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};

exports.getCoinDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await proxyRequest(`/coins/${id}`, req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};

exports.getMarketChart = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await proxyRequest(`/coins/${id}/market_chart`, req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};
