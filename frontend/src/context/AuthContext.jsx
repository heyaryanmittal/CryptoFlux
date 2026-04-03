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
        // Store previous state for potential rollback
        const previousWatchlist = user?.watchlist || [];

        try {
            console.log('Updating watchlist for coin:', coinId);
            console.log('Current watchlist before update:', previousWatchlist);

            // OPTIMISTIC UPDATE - Update UI immediately for instant feedback
            const isCurrentlyInWatchlist = previousWatchlist.includes(coinId);
            const optimisticWatchlist = isCurrentlyInWatchlist
                ? previousWatchlist.filter(id => id !== coinId)
                : [...previousWatchlist, coinId];

            // Update UI immediately
            setUser(prev => ({
                ...prev,
                watchlist: optimisticWatchlist
            }));

            // Then sync with backend
            const res = await axios.post(`${API_URL}/user/watchlist`, { coinId });
            console.log('Backend returned watchlist:', res.data);

            // Update with server response (in case of any discrepancies)
            setUser(prev => {
                const updated = { ...prev, watchlist: res.data };
                console.log('Final synced user state:', updated);
                return updated;
            });

            return res.data;
        } catch (error) {
            console.error("Failed to update watchlist", error);

            // ROLLBACK - Revert to previous state on error
            setUser(prev => ({
                ...prev,
                watchlist: previousWatchlist
            }));

            throw error;
        }
    };

    const updatePortfolio = async (coinId, quantity) => {
        const previousPortfolio = user?.portfolio || [];

        try {
            // OPTIMISTIC UPDATE
            const updatedPortfolio = [...previousPortfolio];
            const index = updatedPortfolio.findIndex(item => item.coinId === coinId);

            if (index > -1) {
                if (quantity <= 0) {
                    updatedPortfolio.splice(index, 1);
                } else {
                    updatedPortfolio[index] = { ...updatedPortfolio[index], quantity };
                }
            } else if (quantity > 0) {
                updatedPortfolio.push({ coinId, quantity });
            }

            setUser(prev => ({ ...prev, portfolio: updatedPortfolio }));

            // SYNC WITH BACKEND
            const res = await axios.post(`${API_URL}/user/portfolio`, { coinId, quantity });
            
            setUser(prev => ({ ...prev, portfolio: res.data }));
            return res.data;
        } catch (error) {
            console.error("Failed to update portfolio", error);
            // ROLLBACK
            setUser(prev => ({ ...prev, portfolio: previousPortfolio }));
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, updateWatchlist, updatePortfolio }}>
            {children}
        </AuthContext.Provider>
    );
};
