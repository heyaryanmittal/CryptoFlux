import axios from 'axios';

const API_KEY = import.meta.env.VITE_CG_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

const coingecko = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-cg-demo-api-key': API_KEY,
        'Content-Type': 'application/json',
    }
});

// Add retry logic for rate limits
coingecko.interceptors.response.use(
    response => response,
    async error => {
        const { config, response } = error;
        // Check if it's a 429 error and we haven't retried yet
        if (response && response.status === 429 && !config._retry) {
            config._retry = true;
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return coingecko(config);
        }
        return Promise.reject(error);
    }
);

export default coingecko;
