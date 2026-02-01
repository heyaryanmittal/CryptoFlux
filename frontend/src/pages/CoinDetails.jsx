import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coingecko from '../utils/coingecko';
import Navbar from '../components/Navbar';
import CoinChart from '../components/CoinChart';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Star, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

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

    if (loading) return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex justify-center items-center">Loading...</div>;
    if (!coin) return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex justify-center items-center">Coin not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300 selection:bg-green-500 selection:text-black">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Info & Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full shadow-lg" />
                                <div>
                                    <h1 className="text-4xl font-bold">{coin.name}</h1>
                                    <span className="text-xl text-gray-500 dark:text-gray-400 uppercase font-medium">{coin.symbol}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleWatchlist}
                                className={`p-4 rounded-full border transition-all duration-300 ${user?.watchlist?.includes(id) ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10 hover:text-black dark:hover:text-white'}`}
                            >
                                <Star size={24} fill={user?.watchlist?.includes(id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-4">
                            <div className="text-5xl font-mono font-bold tracking-tight">${coin.market_data.current_price.usd.toLocaleString()}</div>
                            <div className={`flex items-center px-3 py-1 rounded-full text-lg font-bold mb-2 ${coin.market_data.price_change_percentage_24h >= 0 ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                {coin.market_data.price_change_percentage_24h >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-white/5">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-yellow-500 opacity-50"></div>
                            <h3 className="text-xl font-bold mb-6">Price Trend (30 Days)</h3>
                            <CoinChart history={chartData} />
                        </div>
                    </div>

                    {/* Stats & Description */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 bg-white dark:bg-white/5">
                            <h3 className="text-xl font-bold border-b border-gray-200 dark:border-white/10 pb-4">Market Stats</h3>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                                <span className="font-mono font-medium">{formatNumber(coin.market_data.market_cap.usd)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Trading Vol (24h)</span>
                                <span className="font-mono font-medium">{formatNumber(coin.market_data.total_volume.usd)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Circulating Supply</span>
                                <span className="font-mono font-medium">{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">High 24h</span>
                                <span className="font-mono font-medium text-green-600 dark:text-green-400">${coin.market_data.high_24h.usd.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Low 24h</span>
                                <span className="font-mono font-medium text-red-600 dark:text-red-400">${coin.market_data.low_24h.usd.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                            <h3 className="text-xl font-bold mb-4">About {coin.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: coin.description.en ? coin.description.en.split('. ')[0] + '.' : 'No description available.' }}></p>

                            {coin.links.homepage[0] && (
                                <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-medium transition-colors">
                                    Official Website <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CoinDetails;
