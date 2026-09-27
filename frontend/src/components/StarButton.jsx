import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Reusable StarButton component for watchlist toggles.
 */
const StarButton = ({ coinId, className = '', size = 22, onClick }) => {
    const { user, updateWatchlist } = useAuth();
    const isStarred = user?.watchlist?.includes(coinId);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
            onClick(e);
            return;
        }
        try {
            await updateWatchlist(coinId);
        } catch (error) {
            console.error('Failed to update watchlist:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`transition-all z-20 hover:scale-110 active:scale-90 ${className}`}
            aria-label={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
        >
            <Star
                size={size}
                className={isStarred ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'}
                fill={isStarred ? 'currentColor' : 'none'}
            />
        </button>
    );
};

export default StarButton;
