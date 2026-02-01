const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateWatchlist = async (req, res) => {
    try {
        const { coinId } = req.body;
        console.log(`[Watchlist Update] User: ${req.user.id}, Coin: ${coinId}`);

        // First check if coin is in watchlist
        const user = await User.findById(req.user.id).select('watchlist').lean();
        const isInWatchlist = user.watchlist.includes(coinId);

        // Use atomic operation for instant update
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            isInWatchlist
                ? { $pull: { watchlist: coinId } }  // Remove if exists
                : { $addToSet: { watchlist: coinId } }, // Add if doesn't exist (prevents duplicates)
            { new: true, select: 'watchlist' } // Return updated document with only watchlist field
        );

        console.log(`[Watchlist Update] ${isInWatchlist ? 'Removed' : 'Added'} ${coinId}. New watchlist:`, updatedUser.watchlist);
        res.json(updatedUser.watchlist);
    } catch (err) {
        console.error('[Watchlist Update] Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.updatePortfolio = async (req, res) => {
    try {
        const { coinId, quantity } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.portfolio.findIndex(item => item.coinId === coinId);
        if (index > -1) {
            if (quantity <= 0) {
                user.portfolio.splice(index, 1);
            } else {
                user.portfolio[index].quantity = quantity;
            }
        } else {
            if (quantity > 0) user.portfolio.push({ coinId, quantity });
        }
        await user.save();
        res.json(user.portfolio);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
