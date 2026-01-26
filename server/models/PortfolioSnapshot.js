const mongoose = require('mongoose');

const portfolioSnapshotSchema = new mongoose.Schema({
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
  snapshotDate: {
    type: Date,
    required: true
  },
  totalValue: {
    type: Number,
    required: true,
    default: 0
  },
  cashBalance: {
    type: Number,
    default: 0
  },
  invested: {
    type: Number,
    default: 0
  },
  unrealizedPnl: {
    type: Number,
    default: 0
  },
  realizedPnl: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    default: 0
  },
  totalReturn: {
    type: Number,
    default: 0
  },
  totalReturnPercent: {
    type: Number,
    default: 0
  },
  // Store position details for historical reference
  positions: [{
    symbol: String,
    assetType: String,
    qty: Number,
    avgCost: Number,
    costBasis: Number,
    currentPrice: Number,
    currentValue: Number,
    unrealizedPnl: Number
  }],
  // Asset allocation breakdown
  byAssetType: {
    type: Map,
    of: {
      value: Number,
      percentage: Number,
      count: Number
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
portfolioSnapshotSchema.index({ portfolioId: 1, snapshotDate: -1 });
portfolioSnapshotSchema.index({ userId: 1, snapshotDate: -1 });
// Unique constraint to prevent duplicate daily snapshots
portfolioSnapshotSchema.index({ portfolioId: 1, snapshotDate: 1 }, { unique: true });

module.exports = mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);
