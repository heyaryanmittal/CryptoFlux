import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coingecko from '../utils/coingecko';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CoinCard from '../components/CoinCard';
import { SkeletonCard } from '../components/Skeletons';

const Watchlist = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    const watchlistIds = useMemo(() => {
        return user?.watchlist?.join(',') || '';
    }, [user?.watchlist?.length]);

    useEffect(() => {
        if (user && user.watchlist && user.watchlist.length > 0) {
            setLoading(true);
            coingecko.get('/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    ids: watchlistIds,
                    order: 'market_cap_desc',
                    sparkline: false
                }
            })
                .then(res => {
                    setCoins(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching watchlist coins:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setCoins([]);
        }
    }, [watchlistIds]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32">
                <div className="flex items-center gap-4 mb-12">
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} />
                    </motion.button>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl sm:text-4xl font-bold"
                    >
                        My Watchlist
                    </motion.h1>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                        </motion.div>
                    ) : coins.length === 0 ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <Star size={64} className="mx-auto mb-6 text-gray-200 dark:text-gray-800" />
                                <h2 className="text-2xl font-bold mb-3">Your watchlist is empty</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                    Star coins on the dashboard to add them here for quick access and price monitoring.
                                </p>
                                <Link to="/dashboard" className="px-8 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all hover:shadow-lg hover:shadow-green-500/20 active:scale-95">
                                    Browse Marketplace
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence>
                                {coins.map(coin => (
                                    <CoinCard key={coin.id} coin={coin} view="grid" />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Watchlist;
