import { useState, useEffect, useMemo } from 'react';
import coingecko from '../utils/coingecko';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Star, ArrowLeft } from 'lucide-react';

const Watchlist = () => {
    const { user, updateWatchlist } = useAuth();
    const navigate = useNavigate();
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create a stable reference for the watchlist IDs
    const watchlistIds = useMemo(() => {
        const ids = user?.watchlist?.join(',') || '';
        console.log('Watchlist IDs updated:', ids);
        console.log('Watchlist array:', user?.watchlist);
        return ids;
    }, [user?.watchlist?.length, JSON.stringify(user?.watchlist)]);

    const handleRemoveFromWatchlist = async (e, coinId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await updateWatchlist(coinId);
        } catch (error) {
            console.error("Failed to remove from watchlist", error);
        }
    };

    useEffect(() => {
        console.log('Watchlist useEffect triggered. watchlistIds:', watchlistIds);
        if (user && user.watchlist && user.watchlist.length > 0) {
            setLoading(true);
            console.log('Fetching coins for watchlist:', watchlistIds);
            coingecko.get('/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    ids: watchlistIds,
                    order: 'market_cap_desc',
                    sparkline: false
                }
            })
                .then(res => {
                    console.log('Fetched coins:', res.data);
                    setCoins(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching watchlist coins:', err);
                    setLoading(false);
                });
        } else {
            console.log('Watchlist is empty, clearing coins');
            setLoading(false);
            setCoins([]);
        }
    }, [watchlistIds]); // Re-fetch when watchlistIds changes

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-4xl font-bold">My Watchlist</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : coins.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
                        <Star size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Star coins to add them here for quick access.</p>
                        <Link to="/dashboard" className="px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors">
                            Explore Coins
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coins.map(coin => (
                            <Link to={`/coin/${coin.id}`} key={coin.id}>
                                <div className="glass p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-green-500/30 transition-all duration-300 group relative">
                                    <button
                                        onClick={(e) => handleRemoveFromWatchlist(e, coin.id)}
                                        className="absolute top-4 right-4 z-10 p-2 rounded-full text-yellow-400 bg-yellow-400/10 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                        title="Remove from watchlist"
                                    >
                                        <Star size={20} fill="currentColor" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full shadow-lg" />
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{coin.name}</h3>
                                            <span className="text-sm text-gray-500 uppercase font-medium">{coin.symbol}</span>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="text-gray-400 text-xs mb-1">Price</div>
                                        <div className="font-mono text-xl font-medium">${coin.current_price.toLocaleString()}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">24h Change</div>
                                        <div className={`flex items-center gap-1 font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                            {coin.price_change_percentage_24h?.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Watchlist;
