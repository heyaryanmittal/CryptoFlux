const axios = require('axios');

// API keys from environment variables
const API_KEYS = [
    process.env.PRIMARY_CG_API_KEY,
    process.env.BACKUP_CG_API_KEY,
].filter(Boolean);

const BASE_URL = 'https://api.coingecko.com/api/v3';
let currentKeyIndex = 0;

// Simple in-memory cache: { [cacheKey]: { data, timestamp } }
const cache = {};
const CACHE_TTL = 60 * 1000; // 60 seconds

const getApiKey = () => API_KEYS[currentKeyIndex] || '';

const rotateKey = () => {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`[CoinGecko] Rotated to API key index ${currentKeyIndex}`);
    return getApiKey();
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Build a cache key from path + params
const buildCacheKey = (path, params) => {
    const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    return `${path}?${sorted}`;
};

// Generic handler with cache, key rotation, and retry with backoff
const proxyRequest = async (path, params = {}) => {
    // Check cache first
    const cacheKey = buildCacheKey(path, params);
    const cached = cache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    let lastError = null;

    // Try each API key
    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
        try {
            const response = await axios.get(`${BASE_URL}${path}`, {
                params,
                headers: {
                    'x-cg-demo-api-key': getApiKey(),
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            // Cache successful response
            cache[cacheKey] = { data: response.data, timestamp: Date.now() };
            return response.data;

        } catch (error) {
            lastError = error;
            const status = error.response?.status;

            if (status === 429 || status === 401) {
                console.log(`[CoinGecko] Key ${currentKeyIndex} hit ${status}, rotating...`);
                rotateKey();
                // Brief delay before retry with new key
                await delay(500);
                continue;
            }
            // For other errors, don't retry
            throw error;
        }
    }

    // All keys exhausted — serve stale cache if available
    if (cached) {
        console.log(`[CoinGecko] All keys rate-limited, serving stale cache for ${cacheKey}`);
        return cached.data;
    }

    throw lastError;
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

// Add search endpoint for portfolio coin search
exports.searchCoins = async (req, res) => {
    try {
        const data = await proxyRequest('/search', req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};

// Add simple price endpoint for portfolio
exports.getSimplePrice = async (req, res) => {
    try {
        const data = await proxyRequest('/simple/price', req.query);
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
};
