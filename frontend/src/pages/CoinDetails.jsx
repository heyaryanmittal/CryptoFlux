import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coingecko from '../utils/coingecko';
import Navbar from '../components/Navbar';
import CoinChart from '../components/CoinChart';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Star, ArrowUpRight, ArrowDownRight, ExternalLink, Activity, Info, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CoinDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, updateWatchlist } = useAuth();
    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatNumber = (num) => {
        if (!num) return 'N/A';
        if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
        return '$' + num.toLocaleString();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coinRes, chartRes] = await Promise.all([
                    coingecko.get(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`),
                    coingecko.get(`/coins/${id}/market_chart?vs_currency=usd&days=30`)
                ]);
                setCoin(coinRes.data);
                setChartData(chartRes.data.prices);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleWatchlist = async () => {
        try {
            await updateWatchlist(id);
        } catch (err) {
            console.error("Failed to update watchlist", err);
        }
    };

    const isStarred = user?.watchlist?.includes(id);

    const SkeletonLoader = () => (
        <div className="container mx-auto px-6 pt-32 animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-xl w-32" />
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/10" />
                            <div className="space-y-2">
                                <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-48" />
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
                            </div>
                        </div>
                    </div>
                    <div className="h-20 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                    <div className="h-96 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                </div>
                <div className="space-y-6">
                    <div className="h-80 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                    <div className="h-64 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <SkeletonLoader />
        </div>
    );
    
    if (!coin) return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col justify-center items-center gap-4 px-6 text-center">
            <Navbar />
            <Activity size={64} className="text-gray-300 dark:text-gray-700" />
            <h1 className="text-2xl font-bold">Cryptocurrency Not Found</h1>
            <p className="text-gray-500 max-w-sm">The digital asset you're looking for could not be retrieved from the network.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-8 py-3 bg-green-500 text-black font-bold rounded-xl active:scale-95 transition-all">Return to Dashboard</button>
        </div>
    );

    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors group px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full w-fit hover:border-green-500/50"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </motion.button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Info & Chart */}
                    <motion.div 
                        {...animationProps}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                                    <img src={coin.image.large} alt={coin.name} className="w-20 h-20 rounded-full shadow-2xl relative z-10 p-1 bg-white dark:bg-black border-2 border-green-500/20" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-5xl font-extrabold tracking-tight">{coin.name}</h1>
                                        <span className="bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Rank #{coin.market_cap_rank}</span>
                                    </div>
                                    <span className="text-xl text-gray-500 dark:text-gray-400 uppercase font-bold tracking-[0.2em]">{coin.symbol}</span>
                                </div>
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleWatchlist}
                                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 font-bold
                                    ${isStarred 
                                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/30' 
                                        : 'bg-white dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10 hover:border-yellow-500/50 hover:text-yellow-500'}`}
                            >
                                <Star size={24} fill={isStarred ? "currentColor" : "none"} />
                                <span className={isStarred ? 'block' : 'hidden md:block'}>{isStarred ? 'Tracked' : 'Track Asset'}</span>
                            </motion.button>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="glass p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:bg-green-500/20" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 md:justify-between">
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <DollarSign size={14} /> Global Market Value
                                    </div>
                                    <div className="text-6xl font-mono font-bold tracking-tighter text-gray-900 dark:text-white">
                                        ${coin.market_data.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                    </div>
                                </div>
                                <div className={`flex items-center px-6 py-3 rounded-2xl text-xl font-extrabold shadow-sm ${coin.market_data.price_change_percentage_24h >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {coin.market_data.price_change_percentage_24h >= 0 ? <TrendingUp size={24} strokeWidth={3} /> : <TrendingDown size={24} strokeWidth={3} />}
                                    {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
                                    <span className="text-xs uppercase font-bold ml-2 opacity-60">24h</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Component */}
                        <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-white/5">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <Activity className="text-green-500" /> Historical Performance
                                </h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">30 Days Analysis</span>
                                </div>
                            </div>
                            <div className="relative h-[400px]">
                                <CoinChart history={chartData} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats & Description Sidebar */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 space-y-6 bg-white dark:bg-white/5"
                        >
                            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-white/10 pb-4 mb-2 flex items-center gap-2">
                                Market Indicators
                            </h3>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center group/stat">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Market Cap</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white group-hover/stat:text-green-500 transition-colors">{formatNumber(coin.market_data.market_cap.usd)}</span>
                                </div>
                                <div className="flex justify-between items-center group/stat">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">24h Volume</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white group-hover/stat:text-green-500 transition-colors">{formatNumber(coin.market_data.total_volume.usd)}</span>
                                </div>
                                <div className="flex justify-between items-center group/stat">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Supply</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white group-hover/stat:text-green-500 transition-colors">{coin.market_data.circulating_supply.toLocaleString()} <span className="text-xs uppercase opacity-40">{coin.symbol}</span></span>
                                </div>
                                <div className="pt-4 space-y-4">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                        <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">High 24h</span>
                                        <span className="font-mono font-bold text-green-600 dark:text-green-400">${coin.market_data.high_24h.usd.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                        <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Low 24h</span>
                                        <span className="font-mono font-bold text-red-500">${coin.market_data.low_24h.usd.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 relative overflow-hidden"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info size={18} className="text-blue-500" /> Executive Summary
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: coin.description.en ? coin.description.en.split('. ').slice(0, 3).join('. ') + '.' : 'Information about this asset is currently being indexed.' }}></p>

                            {coin.links.homepage[0] && (
                                <a 
                                    href={coin.links.homepage[0]} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-extrabold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl dark:shadow-white/5"
                                >
                                    Ecosystem Overview <ExternalLink size={18} />
                                </a>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CoinDetails;
