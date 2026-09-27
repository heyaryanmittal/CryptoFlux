import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import StarButton from './StarButton';
import { formatCurrency, formatCompactNumber, formatPercentage } from '../utils/formatters';

const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

/**
 * Reusable CoinCard component supporting both 'grid' and 'list' view formats.
 */
const CoinCard = ({ coin, view = 'grid' }) => {
    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
        <motion.div variants={itemAnimation} whileHover={{ y: -4 }} className="relative">
            <Link to={`/coin/${coin.id}`}>
                <div
                    className={`glass rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-green-500 dark:hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden ${
                        view === 'list' ? 'grid grid-cols-12 items-center gap-4 px-6 py-4' : 'p-6 flex flex-col'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-all duration-500" />

                    {/* Coin Branding */}
                    <div className={`flex items-center gap-4 ${view === 'list' ? 'col-span-4 md:col-span-3' : 'mb-6'}`}>
                        <div className="relative">
                            <img
                                src={coin.image}
                                alt={coin.name}
                                className={`${
                                    view === 'list' ? 'w-8 h-8' : 'w-12 h-12'
                                } rounded-full ring-2 ring-gray-100 dark:ring-white/5 group-hover:ring-green-500/30 transition-all`}
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className={`font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate ${view === 'list' ? 'text-base' : 'text-lg'}`}>
                                {coin.name}
                            </h3>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{coin.symbol}</span>
                        </div>
                    </div>

                    {/* Price & Stats */}
                    <div className={view === 'list' ? 'contents' : ''}>
                        <div className={view === 'list' ? 'col-span-3 md:col-span-3 lg:col-span-2 text-right' : 'mb-4'}>
                            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                                {formatCurrency(coin.current_price)}
                            </div>
                            <div className={`text-[10px] text-gray-400 uppercase tracking-tighter ${view === 'list' ? 'hidden' : 'block'}`}>
                                Last Price USD
                            </div>
                        </div>

                        {view === 'list' && (
                            <div className="hidden md:block col-span-3 lg:col-span-2 text-right font-mono text-gray-600 dark:text-gray-400">
                                {formatCompactNumber(coin.market_cap)}
                            </div>
                        )}

                        {view === 'list' && (
                            <div className="hidden lg:block col-span-2 text-right font-mono text-gray-600 dark:text-gray-400">
                                {formatCompactNumber(coin.total_volume)}
                            </div>
                        )}

                        <div className={view === 'list' ? 'col-span-3 md:col-span-2 lg:col-span-2 flex justify-end' : ''}>
                            <div className={`flex items-center gap-1 font-bold text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {formatPercentage(coin.price_change_percentage_24h)}
                            </div>
                        </div>
                    </div>

                    {/* Watchlist Action */}
                    <StarButton
                        coinId={coin.id}
                        className={view === 'list' ? 'col-span-2 md:col-span-1 flex justify-end items-center' : 'absolute top-4 right-4'}
                    />
                </div>
            </Link>
        </motion.div>
    );
};

export default CoinCard;
