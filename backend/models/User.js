const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: { type: [String], default: [] }, // Array of Coin IDs
  portfolio: [{
    coinId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });

// Add index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
