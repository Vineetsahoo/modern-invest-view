const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  baseCurrency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  cashBalance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

portfolioSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
