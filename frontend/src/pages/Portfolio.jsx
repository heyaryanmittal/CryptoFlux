import { useState, useEffect } from 'react';
import axios from 'axios';
import coingecko from '../utils/coingecko';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Plus, Minus, Trash2, PieChart, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [portfolioCoins, setPortfolioCoins] = useState([]);
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [coinId, setCoinId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (user && user.portfolio) {
            setPortfolioCoins(user.portfolio);
            const ids = user.portfolio.map(p => p.coinId).join(',');
            if (ids) {
                coingecko.get('/simple/price', {
                    params: {
                        ids: ids,
                        vs_currencies: 'usd',
                        include_24hr_change: true
                    }
                })
                    .then(res => {
                        setPrices(res.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }
    }, [user]);

    const handleSearch = async (query) => {
        setCoinId(query);
        if (query.length > 2) {
            try {
                const res = await coingecko.get(`/search?query=${query}`);
                setSuggestions(res.data.coins.slice(0, 5));
            } catch (e) { console.error(e); }
        } else {
            setSuggestions([]);
        }
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/user/portfolio`, { coinId: coinId.toLowerCase(), quantity: parseFloat(quantity) }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (err) {
            console.error("Failed to add asset", err);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);

    const openDeleteModal = (coinId) => {
        setAssetToDelete(coinId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!assetToDelete) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            // Sending quantity 0 or negative to remove
            await axios.post(`${API_URL}/user/portfolio`, { coinId: assetToDelete, quantity: 0 }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (err) {
            console.error("Failed to remove asset", err);
        } finally {
            setShowDeleteModal(false);
            setAssetToDelete(null);
        }
    };


    const updateQuantity = async (coinId, newQuantity) => {
        if (newQuantity < 0) return; // Prevent negative quantity

        // Optimistic UI Update
        const updatedPortfolio = portfolioCoins.map(asset =>
            asset.coinId === coinId ? { ...asset, quantity: parseFloat(newQuantity.toFixed(4)) } : asset
        );
        setPortfolioCoins(updatedPortfolio);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/user/portfolio`, { coinId: coinId, quantity: parseFloat(newQuantity.toFixed(4)) }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to update quantity", err);
            window.location.reload();
        }
    };

    const getTotalValue = () => {
        return portfolioCoins.reduce((acc, asset) => {
            const price = prices[asset.coinId]?.usd || 0;
            return acc + (price * asset.quantity);
        }, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-4xl font-bold">My Portfolio</h1>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors"
                    >
                        <Plus size={20} /> Add Asset
                    </button>
                </div>

                {/* Total Balance Card */}
                <div className="glass p-10 rounded-3xl border border-gray-200 dark:border-white/10 mb-12 bg-gradient-to-br from-green-500/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-medium">Total Balance</div>
                        <div className="text-5xl md:text-6xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">${getTotalValue().toLocaleString()}</div>
                    </div>
                </div>

                {isAdding && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4">
                        <div className="glass w-full max-w-md p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative shadow-2xl bg-white dark:bg-gray-900">
                            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">✕</button>
                            <h2 className="text-2xl font-bold mb-6">Add Asset</h2>
                            <form onSubmit={handleAddAsset} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Coin Name/ID</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3.5 text-gray-500"><Search size={18} /></div>
                                        <input
                                            type="text"
                                            value={coinId}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-black dark:text-white"
                                            placeholder="e.g. bitcoin"
                                            required
                                        />
                                        {suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl mt-1 max-h-48 overflow-y-auto z-10 shadow-xl">
                                                {suggestions.map(s => (
                                                    <div key={s.id} onClick={() => { setCoinId(s.id); setSuggestions([]); }} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 text-black dark:text-white">
                                                        <img src={s.thumb} className="w-6 h-6 rounded-full" />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{s.name}</span>
                                                            <span className="text-xs text-gray-500 uppercase">{s.symbol}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-black dark:text-white"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-green-500 text-white dark:text-black font-bold py-3 rounded-xl hover:bg-green-600 dark:hover:bg-green-400 transition-colors hover:shadow-lg hover:shadow-green-500/20 transform active:scale-95 duration-200">
                                    Add to Portfolio
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 text-sm uppercase tracking-wider">
                                <th className="py-5 px-6 font-medium">Asset</th>
                                <th className="py-5 px-6 font-medium">Price</th>
                                <th className="py-5 px-6 font-medium">Quantity</th>
                                <th className="py-5 px-6 font-medium">Value</th>
                                <th className="py-5 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {portfolioCoins.map(asset => {
                                const price = prices[asset.coinId]?.usd || 0;
                                const change = prices[asset.coinId]?.usd_24h_change || 0;
                                const value = price * asset.quantity;

                                return (
                                    <tr key={asset.coinId} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                                        <td className="py-5 px-6 font-medium capitalize flex items-center gap-2">
                                            <span className="bg-gray-200 dark:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">{asset.coinId.substring(0, 2)}</span>
                                            {asset.coinId}
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="font-mono">${price.toLocaleString()}</div>
                                            <div className={`text-xs ${change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{change.toFixed(2)}%</div>
                                        </td>
                                        <td className="py-5 px-6 font-mono text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(asset.coinId, asset.quantity - 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="min-w-[40px] text-center font-bold">{asset.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(asset.coinId, asset.quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 font-mono font-medium text-lg">${value.toLocaleString()}</td>
                                        <td className="py-5 px-6 text-right">
                                            <button onClick={() => openDeleteModal(asset.coinId)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {portfolioCoins.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-white/5 rounded-b-3xl mt-[-1px] border border-gray-200 dark:border-white/10 border-t-0">
                        <PieChart size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">Portfolio is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400">Add assets above to start tracking your wealth.</p>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4">
                        <div className="glass w-full max-w-sm p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative shadow-2xl bg-white dark:bg-gray-900 text-center">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Are you sure you want to remove this asset from your portfolio? This action cannot be undone.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Portfolio;
