const mongoose = require('mongoose');

const priceQuoteSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
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
    default: 'mock'
  },
  asOf: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

priceQuoteSchema.index({ symbol: 1 });

module.exports = mongoose.model('PriceQuote', priceQuoteSchema);
