import { useState, useEffect } from 'react';
import coingecko from '../utils/coingecko';
import Navbar from '../components/Navbar';
import { ArrowLeftRight, ExternalLink } from 'lucide-react';

const Exchanges = () => {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        coingecko.get('/exchanges', {
            params: {
                per_page: 50,
                page: 1
            }
        })
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setExchanges(res.data);
                } else {
                    setError('Invalid response from API');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading exchanges:', err);
                setError(err.response?.data?.error || 'Failed to load exchanges. Please try again later.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-2xl text-green-600 dark:text-green-400">
                        <ArrowLeftRight size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Top Exchanges</h1>
                        <p className="text-gray-500 dark:text-gray-400">Ranked by trading volume and trust score</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-500/20">
                        <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Oops! Something went wrong</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-400 transition-colors">
                            Retry
                        </button>
                    </div>
                ) : exchanges.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
                        <h2 className="text-2xl font-bold mb-2">No exchanges found</h2>
                        <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {exchanges.map((ex, index) => (
                            <div key={ex.id} className="glass p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 transition-all flex flex-col md:flex-row items-center gap-6 group">
                                <div className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-12 text-center">{ex.trust_score_rank || '-'}</div>
                                <img src={ex.image} alt={ex.name} className="w-12 h-12 rounded-full shadow-sm" />

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{ex.name}</h3>
                                    <span className="text-sm text-gray-500">Established {ex.year_established || 'N/A'} • {ex.country || 'Global'}</span>
                                </div>

                                <div className="flex flex-col items-center md:items-end min-w-[150px]">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trust Score</div>
                                    <div className="flex gap-1">
                                        {[...Array(10)].map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${i < (ex.trust_score || 0) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center md:text-right min-w-[200px]">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Volume (BTC)</div>
                                    <div className="font-mono text-lg font-bold">{ex.trade_volume_24h_btc ? ex.trade_volume_24h_btc.toFixed(2) : 'N/A'} {ex.trade_volume_24h_btc ? 'BTC' : ''}</div>
                                </div>

                                <a href={ex.url} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-green-500 hover:text-white transition-colors">
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Exchanges;
