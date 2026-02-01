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
        const user = await User.findById(req.user.id);

        // Handle add/remove toggle behavior or specific add/remove
        // Assuming toggle for simplicity if not specified, 
        // but robust API might separate add/remove. 
        // Prompt says "Star icon -> add/remove".
        if (user.watchlist.includes(coinId)) {
            user.watchlist = user.watchlist.filter(id => id !== coinId);
            console.log(`[Watchlist Update] Removed ${coinId}. New watchlist:`, user.watchlist);
        } else {
            user.watchlist.push(coinId);
            console.log(`[Watchlist Update] Added ${coinId}. New watchlist:`, user.watchlist);
        }
        await user.save();
        console.log(`[Watchlist Update] Returning watchlist:`, user.watchlist);
        res.json(user.watchlist);
    } catch (err) {
        console.error('[Watchlist Update] Error:', err);
        res.status(500).send('Server Error');
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
