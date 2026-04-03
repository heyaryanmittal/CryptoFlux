import { useState, useEffect, useMemo } from 'react';
import coingecko from '../utils/coingecko';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Grid, List, TrendingUp, TrendingDown, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, updateWatchlist } = useAuth();
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;
    const MAX_PAGES = 10;

    const [error, setError] = useState(null);
    const [pageCache, setPageCache] = useState({});

    useEffect(() => {
        if (pageCache[page]) {
            setCoins(pageCache[page]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        coingecko.get('/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: PAGE_SIZE,
                page: page,
                sparkline: false
            }
        })
            .then(res => {
                setCoins(res.data);
                setPageCache(prev => ({ ...prev, [page]: res.data }));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load data. API rate limit may have been reached.");
                setLoading(false);
            });
    }, [page, pageCache]);

    const handleStar = async (e, coinId) => {
        e.preventDefault();
        try {
            await updateWatchlist(coinId);
        } catch (error) {
            console.error(error);
        }
    };

    const isStarred = (coinId) => user?.watchlist?.includes(coinId);

    const formatNumber = (num) => {
        if (!num) return 'N/A';
        if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
        return '$' + num.toLocaleString();
    };

    const filteredCoins = useMemo(() => {
        return coins.filter(coin =>
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    }, [coins, search]);

    const SkeletonCard = () => (
        <div className="glass rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
            </div>
        </div>
    );

    const SkeletonRow = () => (
        <div className="glass rounded-2xl px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20" />
        </div>
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32">

                {/* Welcome & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-2xl sm:text-4xl font-bold mb-2">Welcome, <span className="bg-gradient-to-r from-green-500 to-yellow-500 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">{user?.name}</span></h1>
                        <p className="text-gray-500 dark:text-gray-400">Track and analyze market movements in real-time.</p>
                    </motion.div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Link to="/watchlist" className="glass group p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-green-500/50 dark:hover:border-green-500/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors" />
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Watchlist</div>
                            <div className="text-3xl font-bold text-green-500 dark:text-green-400 flex items-baseline gap-1">
                                {user?.watchlist?.length || 0} 
                                <span className="text-xs text-gray-500 font-normal">assets</span>
                            </div>
                        </Link>
                        <Link to="/portfolio" className="glass group p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-yellow-500/50 dark:hover:border-yellow-500/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors" />
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Portfolio</div>
                            <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 flex items-baseline gap-1">
                                {user?.portfolio?.length || 0}
                                <span className="text-xs text-gray-500 font-normal">assets</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            className="w-full bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 focus:border-green-500 focus:outline-none transition-all placeholder-gray-500 dark:placeholder-gray-600 text-sm sm:text-base"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-gray-100 dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-gray-100 dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div key="loader" className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
                            {[...Array(PAGE_SIZE)].map((_, i) => view === 'grid' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />)}
                        </div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-500/20 max-w-2xl mx-auto"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Network Error</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 px-6">{error}</p>
                            <button
                                onClick={() => { setPageCache({}); setPage(p => p); }}
                                className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-red-500/20"
                            >
                                <RefreshCw size={18} /> Retry Connection
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={view + page}
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}
                        >
                            {/* List Headers (only in list view) */}
                            {view === 'list' && (
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 dark:border-white/5">
                                    <div className="col-span-4 md:col-span-3">Asset</div>
                                    <div className="col-span-3 md:col-span-3 lg:col-span-2 text-right">Price</div>
                                    <div className="hidden md:block col-span-3 lg:col-span-2 text-right text-gray-500">Market Cap</div>
                                    <div className="hidden lg:block col-span-2 text-right text-gray-500">Volume</div>
                                    <div className="col-span-3 md:col-span-2 lg:col-span-2 text-right">24h Change</div>
                                    <div className="col-span-2 md:col-span-1 text-right">Fav</div>
                                </div>
                            )}

                            {filteredCoins.map(coin => (
                                <motion.div 
                                    variants={item}
                                    key={coin.id}
                                    whileHover={{ y: -4 }}
                                    className="relative"
                                >
                                    <Link to={`/coin/${coin.id}`}>
                                        <div className={`glass rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500 dark:hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden 
                                            ${view === 'list' ? 'grid grid-cols-12 items-center gap-4 px-6 py-4' : 'p-6 flex flex-col'}`}>
                                            
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-all duration-500" />
                                            
                                            <div className={`flex items-center gap-4 ${view === 'list' ? 'col-span-4 md:col-span-3' : 'mb-6'}`}>
                                                <div className="relative">
                                                    <img src={coin.image} alt={coin.name} className={`${view === 'list' ? 'w-8 h-8' : 'w-12 h-12'} rounded-full ring-2 ring-gray-100 dark:ring-white/5 group-hover:ring-green-500/30 transition-all`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className={`font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate ${view === 'list' ? 'text-base' : 'text-lg'}`}>{coin.name}</h3>
                                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{coin.symbol}</span>
                                                </div>
                                            </div>

                                            {/* Price & Stats */}
                                            <div className={view === 'list' ? 'contents' : ''}>
                                                <div className={view === 'list' ? 'col-span-3 md:col-span-3 lg:col-span-2 text-right' : 'mb-4'}>
                                                    <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                                                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </div>
                                                    <div className={`text-[10px] text-gray-400 uppercase tracking-tighter ${view === 'list' ? 'hidden' : 'block'}`}>Last Price USD</div>
                                                </div>

                                                {view === 'list' && (
                                                    <div className="hidden md:block col-span-3 lg:col-span-2 text-right font-mono text-gray-600 dark:text-gray-400">
                                                        {formatNumber(coin.market_cap)}
                                                    </div>
                                                )}

                                                {view === 'list' && (
                                                    <div className="hidden lg:block col-span-2 text-right font-mono text-gray-600 dark:text-gray-400">
                                                        {formatNumber(coin.total_volume)}
                                                    </div>
                                                )}

                                                <div className={view === 'list' ? 'col-span-3 md:col-span-2 lg:col-span-2 flex justify-end' : ''}>
                                                    <div className={`flex items-center gap-1 font-bold text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Star Action */}
                                            <button
                                                onClick={(e) => handleStar(e, coin.id)}
                                                className={`transition-all z-20 hover:scale-110 active:scale-90
                                                    ${view === 'list'
                                                        ? 'col-span-2 md:col-span-1 flex justify-end items-center'
                                                        : 'absolute top-4 right-4'
                                                    }`}
                                            >
                                                <Star 
                                                    size={22} 
                                                    className={isStarred(coin.id) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'} 
                                                    fill={isStarred(coin.id) ? "currentColor" : "none"} 
                                                />
                                            </button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-12 gap-6">
                    <motion.button
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm tracking-widest uppercase"
                    >
                        Prev
                    </motion.button>
                    
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-mono text-green-500">{page}</span>
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">/ {MAX_PAGES}</span>
                    </div>

                    <motion.button
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(p => Math.min(MAX_PAGES, p + 1))}
                        disabled={page === MAX_PAGES || loading}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm tracking-widest uppercase"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
