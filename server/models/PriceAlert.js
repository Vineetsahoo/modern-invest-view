const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
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
  alertType: {
    type: String,
    enum: ['TARGET', 'STOP_LOSS', 'PERCENT_CHANGE', 'VOLUME'],
    required: true
  },
  condition: {
    type: String,
    enum: ['ABOVE', 'BELOW', 'EQUALS'],
    required: true
  },
  targetPrice: {
    type: Number,
    min: 0
  },
  currentPrice: {
    type: Number,
    min: 0
  },
  percentChange: {
    type: Number
  },
  triggered: {
    type: Boolean,
    default: false
  },
  triggeredAt: {
    type: Date
  },
  triggeredPrice: {
    type: Number
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  notificationMethod: {
    type: String,
    enum: ['EMAIL', 'SMS', 'IN_APP', 'ALL'],
    default: 'IN_APP'
  },
  active: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    trim: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
priceAlertSchema.index({ userId: 1, active: 1 });
priceAlertSchema.index({ symbol: 1, active: 1 });
priceAlertSchema.index({ triggered: 1, notificationSent: 1 });

// Method to check if alert should trigger
priceAlertSchema.methods.shouldTrigger = function(currentPrice) {
  if (!this.active || this.triggered) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;

  switch (this.condition) {
    case 'ABOVE':
      return currentPrice >= this.targetPrice;
    case 'BELOW':
      return currentPrice <= this.targetPrice;
    case 'EQUALS':
      return Math.abs(currentPrice - this.targetPrice) < 0.01;
    default:
      return false;
  }
};

// Method to trigger the alert
priceAlertSchema.methods.trigger = function(price) {
  this.triggered = true;
  this.triggeredAt = new Date();
  this.triggeredPrice = price;
  this.active = false;
  return this.save();
};

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
