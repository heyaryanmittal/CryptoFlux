import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

/**
 * Clean, reusable component for error messages and empty state UI.
 */
export const ErrorMessage = ({ title = 'Network Error', message, onRetry }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-500/20 max-w-2xl mx-auto"
    >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
            <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 px-6">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-red-500/20"
            >
                <RefreshCw size={18} /> Retry Connection
            </button>
        )}
    </motion.div>
);

export const EmptyState = ({ icon: Icon = Search, title, message, actionLabel, onAction }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 max-w-lg mx-auto"
    >
        <Icon size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {message && <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{message}</p>}
        {actionLabel && onAction && (
            <button
                onClick={onAction}
                className="px-6 py-2 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all text-sm"
            >
                {actionLabel}
            </button>
        )}
    </motion.div>
);
