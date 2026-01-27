const PriceAlert = require('../models/PriceAlert');
const Watchlist = require('../models/Watchlist');
const PriceQuote = require('../models/PriceQuote');
const User = require('../models/User');
const { sendPriceAlertEmail } = require('../services/notificationService');

// Get all alerts for the user
const getAlerts = async (req, res) => {
  try {
    const { active, triggered } = req.query;
    
    const filter = { userId: req.user._id };
    if (active !== undefined) filter.active = active === 'true';
    if (triggered !== undefined) filter.triggered = triggered === 'true';
    
    const alerts = await PriceAlert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new alert
const createAlert = async (req, res) => {
  try {
    const {
      symbol,
      alertType,
      condition,
      targetPrice,
      percentChange,
      notificationMethod,
      message,
      expiresAt
    } = req.body;
    
    if (!symbol || !alertType || !condition) {
      return res.status(400).json({ error: 'Symbol, alertType, and condition are required' });
    }
    
    // Get current price for reference
    const quote = await PriceQuote.findOne({ symbol: symbol.toUpperCase() });
    
    const alert = await PriceAlert.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      alertType,
      condition,
      targetPrice,
      currentPrice: quote?.price || 0,
      percentChange,
      notificationMethod: notificationMethod || 'IN_APP',
      message,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });
    
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create alerts from watchlist items
const createFromWatchlist = async (req, res) => {
  try {
    const watchlistItems = await Watchlist.find({ userId: req.user._id });
    const created = [];
    
    for (const item of watchlistItems) {
      // Create target price alert if set
      if (item.targetPrice > 0) {
        const targetAlert = await PriceAlert.create({
          userId: req.user._id,
          symbol: item.symbol,
          alertType: 'TARGET',
          condition: 'ABOVE',
          targetPrice: item.targetPrice,
          notificationMethod: 'IN_APP',
          message: `${item.symbol} reached target price of ₹${item.targetPrice}`
        });
        created.push(targetAlert);
      }
      
      // Create stop loss alert if set
      if (item.stopPrice > 0) {
        const stopAlert = await PriceAlert.create({
          userId: req.user._id,
          symbol: item.symbol,
          alertType: 'STOP_LOSS',
          condition: 'BELOW',
          targetPrice: item.stopPrice,
          notificationMethod: 'IN_APP',
          message: `${item.symbol} dropped below stop price of ₹${item.stopPrice}`
        });
        created.push(stopAlert);
      }
    }
    
    res.json({
      message: `Created ${created.length} alerts from watchlist`,
      alerts: created
    });
  } catch (error) {
    console.error('Error creating alerts from watchlist:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an alert
const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const alert = await PriceAlert.findOne({ _id: id, userId: req.user._id });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Don't allow updating triggered alerts
    if (alert.triggered) {
      return res.status(400).json({ error: 'Cannot update triggered alert' });
    }
    
    Object.assign(alert, updates);
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an alert
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alert = await PriceAlert.findOne({ _id: id, userId: req.user._id });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    await alert.deleteOne();
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check and trigger alerts (used by cron job or manual check)
const checkAlerts = async (req, res) => {
  try {
    const activeAlerts = await PriceAlert.find({
      active: true,
      triggered: false,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    const triggered = [];
    const symbols = [...new Set(activeAlerts.map(a => a.symbol))];
    
    // Get current prices for all symbols
    const quotes = await PriceQuote.find({ symbol: { $in: symbols } });
    const priceMap = quotes.reduce((acc, q) => {
      acc[q.symbol] = q.price;
      return acc;
    }, {});
    
    // Check each alert
    for (const alert of activeAlerts) {
      const currentPrice = priceMap[alert.symbol];
      if (!currentPrice) continue;
      
      if (alert.shouldTrigger(currentPrice)) {
        await alert.trigger(currentPrice);
        triggered.push({
          alertId: alert._id,
          symbol: alert.symbol,
          type: alert.alertType,
          targetPrice: alert.targetPrice,
          triggeredPrice: currentPrice,
          message: alert.message
        });
        
        // Send notification
        if (alert.notificationMethod !== 'IN_APP') {
          try {
            const user = await User.findById(alert.userId);
            if (user && user.email) {
              await sendPriceAlertEmail(user.email, alert);
              alert.notificationSent = true;
              await alert.save();
            }
          } catch (notifError) {
            console.error(`[ALERT] Failed to send notification for alert ${alert._id}:`, notifError.message);
          }
        }
      }
    }
    
    res.json({
      checked: activeAlerts.length,
      triggered: triggered.length,
      alerts: triggered
    });
  } catch (error) {
    console.error('Error checking alerts:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  createFromWatchlist,
  updateAlert,
  deleteAlert,
  checkAlerts
};
