import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Default to localhost for dev, update for prod
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await axios.get(`${API_URL}/user/profile`);
                    setUser(res.data);
                } catch (error) {
                    console.error("Auth Check Failed", error);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateWatchlist = async (coinId) => {
        try {
            console.log('Updating watchlist for coin:', coinId);
            console.log('Current watchlist before update:', user?.watchlist);
            const res = await axios.post(`${API_URL}/user/watchlist`, { coinId });
            console.log('Backend returned watchlist:', res.data);
            // The backend returns the updated watchlist array
            setUser(prev => {
                const updated = { ...prev, watchlist: res.data };
                console.log('Updated user state:', updated);
                return updated;
            });
            return res.data;
        } catch (error) {
            console.error("Failed to update watchlist", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, updateWatchlist }}>
            {children}
        </AuthContext.Provider>
    );
};
