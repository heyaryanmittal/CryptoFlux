import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import coingecko from '../utils/coingecko';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Plus, Minus, Trash2, PieChart, Search, ArrowLeft, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio = () => {
    const { user, updatePortfolio } = useAuth();
    const navigate = useNavigate();
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [coinId, setCoinId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchPrices = useCallback(async (portfolio) => {
        if (!portfolio || portfolio.length === 0) {
            setLoading(false);
            return;
        }

        const ids = portfolio.map(p => p.coinId).join(',');
        try {
            const res = await coingecko.get('/simple/price', {
                params: {
                    ids: ids,
                    vs_currencies: 'usd',
                    include_24hr_change: true
                }
            });
            setPrices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.portfolio) {
            // Initial load or when portfolio structure changes significantly
            fetchPrices(user.portfolio);
        }
    }, [user?.portfolio?.length]); // Only refetch when number of items changes to avoid excessive calls

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
        setIsSubmitting(true);
        try {
            await updatePortfolio(coinId.toLowerCase(), parseFloat(quantity));
            setCoinId('');
            setQuantity('');
            setIsAdding(false);
            // The fetchPrices will trigger due to length change if it's a new coin
        } catch (err) {
            console.error("Failed to add asset", err);
        } finally {
            setIsSubmitting(false);
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
        setIsSubmitting(true);
        try {
            await updatePortfolio(assetToDelete, 0);
        } catch (err) {
            console.error("Failed to remove asset", err);
        } finally {
            setIsSubmitting(false);
            setShowDeleteModal(false);
            setAssetToDelete(null);
        }
    };

    const handleUpdateQuantity = async (coinId, newQuantity) => {
        if (newQuantity < 0) return;
        try {
            await updatePortfolio(coinId, parseFloat(newQuantity.toFixed(4)));
        } catch (err) {
            console.error("Failed to update quantity", err);
        }
    };

    const getTotalValue = () => {
        if (!user || !user.portfolio) return 0;
        return user.portfolio.reduce((acc, asset) => {
            const price = prices[asset.coinId]?.usd || 0;
            return acc + (price * asset.quantity);
        }, 0);
    };

    const TableSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="h-20 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl w-full"></div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-4xl font-bold">My Portfolio</h1>
                    </motion.div>
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setIsAdding(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-shadow hover:shadow-lg hover:shadow-green-500/20"
                    >
                        <Plus size={20} /> Add Asset
                    </motion.button>
                </div>

                {/* Total Balance Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-10 rounded-3xl border border-gray-200 dark:border-white/10 mb-12 bg-gradient-to-br from-green-500/10 to-transparent relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-medium flex items-center gap-2">
                           <TrendingUp size={16} /> Total Net Worth
                        </div>
                        <motion.div 
                            key={getTotalValue()}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            className="text-5xl md:text-6xl font-mono font-bold tracking-tight text-gray-900 dark:text-white"
                        >
                            ${getTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Add Asset Modal */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="glass w-full max-w-md p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative shadow-2xl bg-white dark:bg-gray-900"
                            >
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
                                            <AnimatePresence>
                                                {suggestions.length > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl mt-1 max-h-48 overflow-y-auto z-50 shadow-xl"
                                                    >
                                                        {suggestions.map(s => (
                                                            <div key={s.id} onClick={() => { setCoinId(s.id); setSuggestions([]); }} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 text-black dark:text-white">
                                                                <img src={s.thumb} className="w-6 h-6 rounded-full" />
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{s.name}</span>
                                                                    <span className="text-xs text-gray-500 uppercase">{s.symbol}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-green-500 text-white dark:text-black font-bold py-3 rounded-xl hover:bg-green-600 dark:hover:bg-green-400 transition-all hover:shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Add to Portfolio'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 text-sm uppercase tracking-wider">
                                <th className="py-5 px-6 font-medium">Asset</th>
                                <th className="py-5 px-6 font-medium">Price</th>
                                <th className="py-5 px-6 font-medium">Quantity</th>
                                <th className="py-5 px-6 font-medium">Value</th>
                                <th className="py-5 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10">
                                        <TableSkeleton />
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {user?.portfolio?.map(asset => {
                                        const price = prices[asset.coinId]?.usd || 0;
                                        const change = prices[asset.coinId]?.usd_24h_change || 0;
                                        const value = price * asset.quantity;

                                        return (
                                            <motion.tr 
                                                layout
                                                key={asset.coinId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                            >
                                                <td className="py-5 px-6 font-medium capitalize flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-bold group-hover:bg-green-500 group-hover:text-black transition-all">
                                                        {asset.coinId.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 dark:text-white font-bold">{asset.coinId}</span>
                                                        <span className="text-xs text-gray-400 uppercase">Crypto Asset</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="font-mono text-gray-900 dark:text-white font-semibold">
                                                        ${price > 0 ? price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '---'}
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                        {Math.abs(change).toFixed(2)}%
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 w-fit rounded-full p-1 border border-transparent hover:border-gray-200 dark:hover:border-white/20 transition-all">
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleUpdateQuantity(asset.coinId, asset.quantity - 0.1)}
                                                            className="w-8 h-8 rounded-full bg-white dark:bg-black/40 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-sm"
                                                        >
                                                            <Minus size={14} />
                                                        </motion.button>
                                                        <span className="min-w-[50px] text-center font-mono font-bold text-gray-900 dark:text-white">
                                                            {asset.quantity.toFixed(4).replace(/\.?0+$/, '')}
                                                        </span>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleUpdateQuantity(asset.coinId, asset.quantity + 0.1)}
                                                            className="w-8 h-8 rounded-full bg-white dark:bg-black/40 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shadow-sm"
                                                        >
                                                            <Plus size={14} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                                                        ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <button onClick={() => openDeleteModal(asset.coinId)} className="text-gray-400 hover:text-red-500 transition-all p-2 rounded-full hover:bg-red-500/10">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && (!user?.portfolio || user?.portfolio?.length === 0) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white dark:bg-white/5 rounded-b-3xl border border-gray-200 dark:border-white/10 border-t-0"
                    >
                        <PieChart size={64} className="mx-auto mb-6 text-gray-300 dark:text-gray-700" />
                        <h2 className="text-2xl font-bold mb-2">Portfolio is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Start building your financial future by adding your first cryptocurrency asset above.</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="mt-8 px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all"
                        >
                            Build Your Portfolio
                        </button>
                    </motion.div>
                )}

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass w-full max-w-sm p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative shadow-2xl bg-white dark:bg-gray-900 text-center"
                            >
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <Trash2 size={32} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Remove Asset?</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white capitalize">{assetToDelete}</span> from your portfolio?
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        disabled={isSubmitting}
                                        onClick={confirmDelete}
                                        className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Delete Asset'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Keep Asset
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
export default Portfolio;

