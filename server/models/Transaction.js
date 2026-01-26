const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  assetType: {
    type: String,
    enum: ['EQUITY', 'ETF', 'REIT', 'MF', 'FD', 'SGB', 'NPS', 'CRYPTO'],
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEES', 'TRANSFER_IN', 'TRANSFER_OUT'],
    required: true
  },
  qty: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  fees: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  tradeDate: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  },
  // Tax lot tracking for capital gains
  taxLotId: {
    type: String,
    trim: true
  },
  taxMethod: {
    type: String,
    enum: ['FIFO', 'LIFO', 'SPECIFIC_ID', 'AVERAGE_COST'],
    default: 'FIFO'
  },
  acquisitionDate: {
    type: Date
  },
  // For SELL transactions - references to specific tax lots being sold
  soldTaxLots: [{
    taxLotId: String,
    qty: Number,
    costBasis: Number,
    acquisitionDate: Date,
    holdingPeriod: Number, // in days
    capitalGainType: {
      type: String,
      enum: ['SHORT_TERM', 'LONG_TERM']
    },
    capitalGain: Number
  }]
}, {
  timestamps: true
});

transactionSchema.index({ userId: 1, portfolioId: 1, symbol: 1, tradeDate: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
