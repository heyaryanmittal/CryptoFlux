import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import coingecko from '../utils/coingecko';
import { useAuth } from '../context/AuthContext';
import { Search, Grid, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CoinCard from '../components/CoinCard';
import { SkeletonCard, SkeletonRow } from '../components/Skeletons';
import { ErrorMessage, EmptyState } from '../components/StateMessage';

const PAGE_SIZE = 20;
const MAX_PAGES = 10;

const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const Dashboard = () => {
    const { user } = useAuth();
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [pageCache, setPageCache] = useState({});

    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimerRef = useRef(null);

    // Fetch coins for current page with caching
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
                console.error('Market fetch error:', err);
                setError("Failed to load data. API rate limit may have been reached.");
                setLoading(false);
            });
    }, [page, pageCache]);

    // Global search via API
    const performGlobalSearch = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults(null);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        try {
            const searchRes = await coingecko.get(`/search?query=${query}`);
            const matchedCoins = searchRes.data.coins.slice(0, 20);

            if (matchedCoins.length === 0) {
                setSearchResults([]);
                setSearchLoading(false);
                return;
            }

            const ids = matchedCoins.map(c => c.id).join(',');
            const marketRes = await coingecko.get('/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    ids: ids,
                    order: 'market_cap_desc',
                    sparkline: false
                }
            });
            setSearchResults(marketRes.data);
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

        if (query.length < 2) {
            setSearchResults(null);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        searchTimerRef.current = setTimeout(() => {
            performGlobalSearch(query);
        }, 500);
    };

    const clearSearch = () => {
        setSearch('');
        setSearchResults(null);
        setSearchLoading(false);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };

    const isSearching = search.length >= 2;
    const displayCoins = isSearching ? (searchResults || []) : coins;
    const isLoading = isSearching ? searchLoading : loading;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32">

                {/* Welcome Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                            Welcome, <span className="bg-gradient-to-r from-green-500 to-yellow-500 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">{user?.name}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Track and analyze market movements in real-time.</p>
                    </motion.div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Link to="/watchlist" className="glass group p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-green-500/50 transition-all cursor-pointer relative overflow-hidden">
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Watchlist</div>
                            <div className="text-3xl font-bold text-green-500 dark:text-green-400 flex items-baseline gap-1">
                                {user?.watchlist?.length || 0}
                                <span className="text-xs text-gray-500 font-normal">assets</span>
                            </div>
                        </Link>
                        <Link to="/portfolio" className="glass group p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-yellow-500/50 transition-all cursor-pointer relative overflow-hidden">
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Portfolio</div>
                            <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 flex items-baseline gap-1">
                                {user?.portfolio?.length || 0}
                                <span className="text-xs text-gray-500 font-normal">assets</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Search Bar & Layout Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search any cryptocurrency globally..."
                            className="w-full bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl pl-12 pr-10 py-2.5 sm:py-3 focus:border-green-500 focus:outline-none transition-all placeholder-gray-500 dark:placeholder-gray-600 text-sm sm:text-base"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        {search && (
                            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        )}
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

                {/* Search Indicator */}
                {isSearching && !isLoading && searchResults && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-green-500">{searchResults.length}</span> results for "<span className="font-medium text-gray-900 dark:text-white">{search}</span>"
                    </div>
                )}

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div key="loader" className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
                            {[...Array(isSearching ? 8 : PAGE_SIZE)].map((_, i) => view === 'grid' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />)}
                        </div>
                    ) : error && !isSearching ? (
                        <ErrorMessage
                            key="error"
                            message={error}
                            onRetry={() => { setPageCache({}); setPage(p => p); }}
                        />
                    ) : displayCoins.length === 0 && isSearching ? (
                        <EmptyState
                            key="no-results"
                            icon={Search}
                            title="No results found"
                            message={`No cryptocurrency matches "${search}"`}
                            actionLabel="Clear Search"
                            onAction={clearSearch}
                        />
                    ) : (
                        <motion.div
                            key={isSearching ? 'search-' + search : view + page}
                            variants={containerAnimation}
                            initial="hidden"
                            animate="show"
                            className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}
                        >
                            {/* List View Headers */}
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

                            {displayCoins.map(coin => (
                                <CoinCard key={coin.id} coin={coin} view={view} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination (Hidden during active search) */}
                {!isSearching && (
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
                )}
            </div>
        </div>
    );
};

export default Dashboard;
