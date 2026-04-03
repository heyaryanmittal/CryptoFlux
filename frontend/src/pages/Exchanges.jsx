import { useState, useEffect } from 'react';
import coingecko from '../utils/coingecko';
import { ArrowLeftRight, ExternalLink, Globe, Award, TrendingUp, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Exchanges = () => {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExchanges = () => {
        setLoading(true);
        setError(null);
        coingecko.get('/exchanges', { params: { per_page: 50, page: 1 } })
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setExchanges(res.data);
                } else {
                    setError('Invalid response from data provider.');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading exchanges:', err);
                setError('Network error: ' + (err.response?.data?.error || 'Failed to establish connection with data provider.'));
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchExchanges();
    }, []);

    const SkeletonRow = () => (
        <div className="glass p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse flex items-center gap-6 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10" />
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24 hidden md:block" />
            <div className="h-10 w-10 bg-gray-200 dark:bg-white/10 rounded-full" />
        </div>
    );

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <div className="container mx-auto px-6 pt-32">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-500/10 rounded-[2rem] text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
                            <ArrowLeftRight size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Top Exchanges</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Market leaders by liquidity and user trust</p>
                        </div>
                    </div>
                    {/* Market Cap Info pill if any? nah keep it simple */}
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid gap-1">
                                {[...Array(12)].map((_, i) => <SkeletonRow key={i} />)}
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl mx-auto text-center py-24 bg-red-50 dark:bg-red-500/5 rounded-[3rem] border border-red-200 dark:border-red-500/20 shadow-2xl shadow-red-500/5"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8">
                                <AlertTriangle size={40} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Connection Failed</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-10 px-10 leading-relaxed">{error}</p>
                            <button
                                onClick={fetchExchanges}
                                className="px-10 py-4 bg-red-500 text-white font-extrabold rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 inline-flex items-center gap-2"
                            >
                                <RefreshCcw size={20} /> Attempt Link Recovery
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.03 } }
                            }}
                            className="grid gap-4"
                        >
                            <div className="grid grid-cols-12 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 dark:border-white/5 mb-2">
                                <div className="col-span-1 text-center">Rank</div>
                                <div className="col-span-11 md:col-span-5 pl-4">Exchange Identity</div>
                                <div className="hidden md:block col-span-2 text-right">Confidence</div>
                                <div className="hidden md:block col-span-3 text-right">24h Trade Vol</div>
                                <div className="hidden md:block col-span-1"></div>
                            </div>
                            {exchanges.map((ex) => (
                                <motion.div 
                                    key={ex.id} 
                                    variants={itemVariants}
                                    whileHover={{ x: 8 }}
                                    className="glass p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all flex flex-col md:grid md:grid-cols-12 items-center gap-6 group relative"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-full scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                                    
                                    <div className="col-span-1 text-2xl font-black text-gray-300 dark:text-gray-700 w-full text-center tabular-nums">
                                        {ex.trust_score_rank || '-'}
                                    </div>
                                    
                                    <div className="col-span-11 md:col-span-5 flex items-center gap-6 w-full pl-0 md:pl-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-green-500/10 blur-xl group-hover:bg-green-500/20 transition-all" />
                                            <img src={ex.image} alt={ex.name} className="w-14 h-14 rounded-2xl shadow-lg relative z-10 p-1 bg-white dark:bg-black border border-gray-100 dark:border-white/10" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold group-hover:text-green-500 transition-colors flex items-center gap-2">
                                                {ex.name} 
                                                <Award size={16} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h3>
                                            <div className="flex items-center gap-x-3 text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><Globe size={14} /> {ex.year_established || 'Global'}</span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                <span className="truncate">{ex.country || 'International'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex col-span-2 flex-col items-end gap-2 pr-4">
                                        <div className="flex gap-1">
                                            {[...Array(10)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1.5 h-6 rounded-full transition-all duration-700 ${i < (ex.trust_score || 0) ? 'bg-gradient-to-t from-green-600 to-green-400 opacity-100' : 'bg-gray-200 dark:bg-white/5 opacity-30'}`} 
                                                    style={{ transitionDelay: `${i * 50}ms` }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Tier {ex.trust_score >= 8 ? 'Alpha' : 'Beta'} Rating</span>
                                    </div>

                                    <div className="col-span-3 text-center md:text-right w-full">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Normalized Capacity</div>
                                        <div className="font-mono text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-end gap-2">
                                            <TrendingUp size={16} className="text-green-500" />
                                            {ex.trade_volume_24h_btc ? ex.trade_volume_24h_btc.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A'} 
                                            <span className="text-xs text-gray-500">BTC</span>
                                        </div>
                                    </div>

                                    <div className="col-span-1 flex justify-end w-full">
                                        <a href={ex.url} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-green-500 hover:text-white hover:scale-110 active:scale-90 transition-all shadow-md group-hover:shadow-green-500/20">
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
export default Exchanges;
