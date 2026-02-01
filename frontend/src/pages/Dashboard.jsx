import { useState, useEffect } from 'react';
import coingecko from '../utils/coingecko';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Search, Grid, List, TrendingUp, TrendingDown, Star } from 'lucide-react';

const Dashboard = () => {
    const { user, updateWatchlist } = useAuth();
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;
    const MAX_PAGES = 10; // 20 * 10 = 200 coins

    const [error, setError] = useState(null);
    const [pageCache, setPageCache] = useState({});

    useEffect(() => {
        // If data is already in cache, use it and do not background fetch
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
                // Update cache
                setPageCache(prev => ({ ...prev, [page]: res.data }));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load data. API rate limit may have been reached.");
                setLoading(false);
            });
    }, [page]);

    const handleStar = async (e, coinId) => {
        e.preventDefault(); // Prevent navigation
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

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">

                {/* Welcome & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome, <span className="bg-gradient-to-r from-green-500 to-yellow-500 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">{user?.name}</span></h1>
                        <p className="text-gray-500 dark:text-gray-400">Here's what's happening in the crypto world today.</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 w-full md:w-auto">
                        <Link to="/watchlist" className="glass p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-green-500 dark:hover:border-white/20 transition-all cursor-pointer">
                            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1 uppercase tracking-wider">Watchlist</div>
                            <div className="text-3xl font-bold text-green-500 dark:text-green-400">{user?.watchlist?.length || 0} <span className="text-sm text-gray-500 font-normal">Assets</span></div>
                        </Link>
                        <Link to="/portfolio" className="glass p-6 rounded-2xl flex-1 md:w-48 border border-gray-200 dark:border-white/5 hover:border-green-500 dark:hover:border-white/20 transition-all cursor-pointer">
                            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1 uppercase tracking-wider">Portfolio</div>
                            <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{user?.portfolio?.length || 0} <span className="text-sm text-gray-500 font-normal">Assets</span></div>
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
                            className="w-full bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-green-500 focus:outline-none transition-all placeholder-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-gray-200 dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-200 dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Coin Grid/List */}
                {/* Coin Grid/List */}
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-500/20">
                        <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Oops! Something went wrong</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => {
                                setPageCache({}); // Clear cache on retry just in case
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
                            }}
                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-400 transition-colors"
                        >
                            Retry Loading Page {page}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* List Headers */}
                        {view === 'list' && (
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 mb-4 bg-gray-50/50 dark:bg-white/5 rounded-xl backdrop-blur-sm">
                                <div className="col-span-4 md:col-span-3 pl-2">Asset</div>
                                <div className="col-span-3 md:col-span-3 lg:col-span-2 text-right">Price</div>
                                <div className="hidden md:block col-span-3 lg:col-span-2 text-right">Market Cap</div>
                                <div className="hidden lg:block col-span-2 text-right">Volume</div>
                                <div className="col-span-3 md:col-span-2 lg:col-span-2 text-right">Change</div>
                                <div className="col-span-2 md:col-span-1 text-right pr-2">Actions</div>
                            </div>
                        )}

                        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
                            {filteredCoins.map(coin => (
                                <Link to={`/coin/${coin.id}`} key={coin.id}>
                                    <div className={`glass rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-green-500/30 transition-all duration-300 group relative overflow-hidden 
                                        ${view === 'list' ? 'grid grid-cols-12 items-center gap-4 px-6 py-4' : 'p-6 flex flex-col relative'}`}>

                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-all duration-500" />

                                        {/* Identity */}
                                        <div className={`flex items-center gap-4 ${view === 'list' ? 'col-span-4 md:col-span-3' : 'mb-6'}`}>
                                            <img src={coin.image} alt={coin.name} className={`${view === 'list' ? 'w-8 h-8' : 'w-12 h-12'} rounded-full shadow-lg`} />
                                            <div className="min-w-0">
                                                <h3 className={`font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate ${view === 'list' ? 'text-base' : 'text-lg'}`}>{coin.name}</h3>
                                                <span className="text-sm text-gray-500 uppercase font-medium tracking-wide">{coin.symbol}</span>
                                            </div>
                                        </div>

                                        {/* Stats Container - using display: contents for grid layout in list view */}
                                        <div className={view === 'list' ? 'contents' : ''}>
                                            <div className={view === 'list' ? 'col-span-3 md:col-span-3 lg:col-span-2 text-right' : 'mb-2'}>
                                                <div className={`text-gray-400 text-xs mb-1 ${view === 'list' ? 'hidden' : 'block'}`}>Current Price</div>
                                                <div className="font-mono font-medium text-gray-900 dark:text-white truncate">
                                                    ${coin.current_price.toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Market Cap - Only visible in list view */}
                                            {view === 'list' && (
                                                <div className="hidden md:block col-span-3 lg:col-span-2 text-right">
                                                    <div className="font-mono text-gray-900 dark:text-white truncate">
                                                        {formatNumber(coin.market_cap)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Volume - Only visible in list view */}
                                            {view === 'list' && (
                                                <div className="hidden lg:block col-span-2 text-right">
                                                    <div className="font-mono text-gray-900 dark:text-white truncate">
                                                        {formatNumber(coin.total_volume)}
                                                    </div>
                                                </div>
                                            )}

                                            <div className={view === 'list' ? 'col-span-3 md:col-span-2 lg:col-span-2 flex justify-end' : ''}>
                                                <div className={`text-gray-400 text-xs mb-1 ${view === 'list' ? 'hidden' : 'block'}`}>24h Change</div>
                                                <div className={`flex items-center gap-1 font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                    {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {coin.price_change_percentage_24h?.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Watchlist Star */}
                                        <button
                                            onClick={(e) => handleStar(e, coin.id)}
                                            className={`transition-all z-20
                                                ${view === 'list'
                                                    ? 'col-span-2 md:col-span-1 flex justify-end items-center h-full w-full'
                                                    : 'absolute top-4 right-4 p-2 rounded-full'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full ${isStarred(coin.id)
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                                }`}>
                                                <Star size={20} fill={isStarred(coin.id) ? "currentColor" : "none"} />
                                            </div>
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-12 gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-6 py-3 rounded-full glass border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-700 dark:text-gray-300"
                            >
                                Previous
                            </button>
                            <span className="font-mono text-gray-500 dark:text-gray-400">
                                Page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of {MAX_PAGES}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(MAX_PAGES, p + 1))}
                                disabled={page === MAX_PAGES}
                                className="px-6 py-3 rounded-full glass border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-700 dark:text-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default Dashboard;
