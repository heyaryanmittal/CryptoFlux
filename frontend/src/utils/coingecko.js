import axios from 'axios';

const PRIMARY_API_KEY = import.meta.env.VITE_CG_API_KEY;
const BACKUP_API_KEY = 'CG-sjoWCzy2kGq7zpmn2VGTLSWJ'; // Production backup key
const BASE_URL = 'https://api.coingecko.com/api/v3';

let currentApiKey = PRIMARY_API_KEY;

const coingecko = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-cg-demo-api-key': currentApiKey,
        'Content-Type': 'application/json',
    }
});

// Helper to update headers when key rotates
const rotateApiKey = () => {
    currentApiKey = (currentApiKey === PRIMARY_API_KEY) ? BACKUP_API_KEY : PRIMARY_API_KEY;
    coingecko.defaults.headers['x-cg-demo-api-key'] = currentApiKey;
    console.log(`[CoinGecko] API Key rotated. New key ends with: ...${currentApiKey.slice(-4)}`);
    return currentApiKey;
};

// Add retry and fallback logic for rate limits and failures
coingecko.interceptors.response.use(
    response => response,
    async error => {
        const { config, response } = error;
        
        // Handle 429 (Rate Limit) or 401/403 (Invalid Key/Unauthorized)
        if (response && (response.status === 429 || response.status === 401 || response.status === 403) && !config._retry) {
            config._retry = true;
            
            // Wait slightly before retrying with new key
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Switch to the other key
            rotateApiKey();
            
            // Update the failed request config with the new key
            config.headers['x-cg-demo-api-key'] = currentApiKey;
            
            return coingecko(config);
        }
        
        return Promise.reject(error);
    }
);

export default coingecko;
