const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['REIT', 'NPS', 'FD', 'SGB', 'DEMAT', 'MUTUAL_FUND']
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currentValue: {
    type: Number,
    required: true,
    min: 0
  },
  units: {
    type: Number,
    default: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date
  },
  interestRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'MATURED', 'WITHDRAWN'],
    default: 'ACTIVE'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add index for faster queries
investmentSchema.index({ userId: 1, type: 1 });

// Virtual for calculating profit/loss
investmentSchema.virtual('profitLoss').get(function() {
  return this.currentValue - this.amount;
});

// Virtual for calculating profit/loss percentage
investmentSchema.virtual('profitLossPercentage').get(function() {
  if (this.amount === 0) return 0;
  return ((this.currentValue - this.amount) / this.amount) * 100;
});

// Ensure virtuals are included in JSON
investmentSchema.set('toJSON', { virtuals: true });
investmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Investment', investmentSchema);
