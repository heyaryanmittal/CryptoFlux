import { useState, useEffect, useMemo } from 'react';
import coingecko from '../utils/coingecko';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Star, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Watchlist = () => {
    const { user, updateWatchlist } = useAuth();
    const navigate = useNavigate();
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    const watchlistIds = useMemo(() => {
        return user?.watchlist?.join(',') || '';
    }, [user?.watchlist?.length]);

    const handleRemoveFromWatchlist = async (e, coinId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await updateWatchlist(coinId);
            // The coins list will update automatically via the useEffect below
        } catch (error) {
            console.error("Failed to remove from watchlist", error);
        }
    };

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

    const SkeletonCard = () => (
        <div className="glass rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="flex-1 h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
            </div>
            <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="container mx-auto px-6 pt-32">
                <div className="flex items-center gap-4 mb-12">
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </motion.button>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold"
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
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Star coins on the dashboard to add them here for quick access and price monitoring.</p>
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
                                    <motion.div
                                        layout
                                        key={coin.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        whileHover={{ y: -5 }}
                                        className="relative"
                                    >
                                        <Link to={`/coin/${coin.id}`}>
                                            <div className="glass p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-all" />
                                                
                                                <button
                                                    onClick={(e) => handleRemoveFromWatchlist(e, coin.id)}
                                                    className="absolute top-4 right-4 z-20 p-2 rounded-full text-yellow-500 bg-yellow-500/10 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                    title="Remove from watchlist"
                                                >
                                                    <Star size={20} fill="currentColor" />
                                                </button>

                                                <div className="flex items-center gap-4 mb-8">
                                                    <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full shadow-lg ring-2 ring-transparent group-hover:ring-green-500/20 transition-all" />
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">{coin.name}</h3>
                                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{coin.symbol}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Current Price</div>
                                                    <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">24h Change</div>
                                                        <div className={`flex items-center gap-1 font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                                        </div>
                                                    </div>
                                                    <Sparkles size={16} className="text-gray-100 dark:text-white/5" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
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
