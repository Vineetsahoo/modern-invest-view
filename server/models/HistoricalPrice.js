const mongoose = require('mongoose');

const historicalPriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  open: {
    type: Number,
    required: true,
    min: 0
  },
  high: {
    type: Number,
    required: true,
    min: 0
  },
  low: {
    type: Number,
    required: true,
    min: 0
  },
  close: {
    type: Number,
    required: true,
    min: 0
  },
  volume: {
    type: Number,
    default: 0,
    min: 0
  },
  adjustedClose: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  source: {
    type: String,
    enum: ['MANUAL', 'MOCK', 'ALPHA_VANTAGE', 'YAHOO', 'NSE', 'BSE'],
    default: 'MOCK'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries by symbol and date range
historicalPriceSchema.index({ symbol: 1, date: -1 });
// Unique constraint to prevent duplicate entries
historicalPriceSchema.index({ symbol: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HistoricalPrice', historicalPriceSchema);
