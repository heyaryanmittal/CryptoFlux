import axios from 'axios';

// The frontend should now hit the backend proxy to avoid CORS and hide the API key
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const coingecko = axios.create({
    baseURL: `${API_URL}/crypto`,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Sync headers if user token changes (this ensures our backend can track user requests if needed)
coingecko.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default coingecko;
