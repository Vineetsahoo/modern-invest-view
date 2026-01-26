const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  targetPrice: {
    type: Number
  },
  stopPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true
});

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
