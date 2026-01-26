const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const PriceQuote = require('../models/PriceQuote');
const HistoricalPrice = require('../models/HistoricalPrice');
const PortfolioSnapshot = require('../models/PortfolioSnapshot');
const PriceAlert = require('../models/PriceAlert');
const { positionAccumulator, computeCurrentValues } = require('../controllers/statsController');

// Update daily price data for all active symbols
const updateDailyPrices = async () => {
  try {
    console.log('[CRON] Starting daily price update...');
    
    // Get all unique symbols from transactions
    const symbols = await Transaction.distinct('symbol');
    
    if (symbols.length === 0) {
      console.log('[CRON] No symbols to update');
      return;
    }
    
    let updated = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const symbol of symbols) {
      try {
        // Get current quote
        const quote = await PriceQuote.findOne({ symbol });
        if (!quote) continue;
        
        const price = quote.price;
        
        // Create today's historical price entry
        const priceData = {
          symbol,
          date: today,
          open: price * (1 + (Math.random() - 0.5) * 0.01),
          high: price * (1 + Math.random() * 0.02),
          low: price * (1 - Math.random() * 0.02),
          close: price,
          adjustedClose: price,
          volume: Math.floor(Math.random() * 1000000 + 100000),
          source: 'MOCK',
          currency: 'INR'
        };
        
        await HistoricalPrice.findOneAndUpdate(
          { 
            symbol,
            date: {
              $gte: today,
              $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
            }
          },
          priceData,
          { upsert: true }
        );
        
        updated++;
      } catch (err) {
        console.error(`[CRON] Error updating price for ${symbol}:`, err.message);
      }
    }
    
    console.log(`[CRON] Daily price update complete. Updated ${updated} symbols.`);
  } catch (error) {
    console.error('[CRON] Daily price update error:', error);
  }
};

// Create daily snapshots for all portfolios
const createDailySnapshots = async () => {
  try {
    console.log('[CRON] Starting daily snapshot creation...');
    
    const portfolios = await Portfolio.find({});
    
    if (portfolios.length === 0) {
      console.log('[CRON] No portfolios to snapshot');
      return;
    }
    
    let created = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const portfolio of portfolios) {
      try {
        // Get all transactions up to today
        const transactions = await Transaction.find({
          portfolioId: portfolio._id,
          tradeDate: { $lte: today }
        }).sort({ tradeDate: 1 });
        
        if (transactions.length === 0) continue;
        
        // Calculate positions
        const positions = positionAccumulator(transactions);
        const statsData = await computeCurrentValues(positions);
        
        // Create/update snapshot
        await PortfolioSnapshot.findOneAndUpdate(
          {
            portfolioId: portfolio._id,
            snapshotDate: {
              $gte: today,
              $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
            }
          },
          {
            userId: portfolio.userId,
            portfolioId: portfolio._id,
            snapshotDate: today,
            totalValue: statsData.totals.currentValue + portfolio.cashBalance,
            cashBalance: portfolio.cashBalance,
            invested: statsData.totals.invested,
            unrealizedPnl: statsData.totals.unrealizedPnl,
            realizedPnl: statsData.totals.realizedPnl,
            income: statsData.totals.income,
            fees: statsData.totals.fees,
            totalReturn: statsData.totals.unrealizedPnl + statsData.totals.realizedPnl + statsData.totals.income - statsData.totals.fees,
            totalReturnPercent: statsData.totals.invested > 0 
              ? ((statsData.totals.unrealizedPnl + statsData.totals.realizedPnl + statsData.totals.income - statsData.totals.fees) / statsData.totals.invested) * 100 
              : 0,
            positions: statsData.positionsWithValue.map(p => ({
              symbol: p.symbol,
              assetType: p.assetType,
              qty: p.qty,
              avgCost: p.avgCost,
              costBasis: p.costBasis,
              currentPrice: p.currentPrice,
              currentValue: p.currentValue,
              unrealizedPnl: p.unrealizedPnl
            })),
            byAssetType: statsData.byAssetType
          },
          { upsert: true }
        );
        
        created++;
      } catch (err) {
        console.error(`[CRON] Error creating snapshot for portfolio ${portfolio._id}:`, err.message);
      }
    }
    
    console.log(`[CRON] Daily snapshot creation complete. Created ${created} snapshots.`);
  } catch (error) {
    console.error('[CRON] Daily snapshot creation error:', error);
  }
};

// Check and trigger price alerts
const checkPriceAlerts = async () => {
  try {
    console.log('[CRON] Checking price alerts...');
    
    const activeAlerts = await PriceAlert.find({
      active: true,
      triggered: false,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    if (activeAlerts.length === 0) {
      console.log('[CRON] No active alerts to check');
      return;
    }
    
    const symbols = [...new Set(activeAlerts.map(a => a.symbol))];
    
    // Get current prices
    const quotes = await PriceQuote.find({ symbol: { $in: symbols } });
    const priceMap = quotes.reduce((acc, q) => {
      acc[q.symbol] = q.price;
      return acc;
    }, {});
    
    let triggered = 0;
    
    // Check each alert
    for (const alert of activeAlerts) {
      try {
        const currentPrice = priceMap[alert.symbol];
        if (!currentPrice) continue;
        
        if (alert.shouldTrigger(currentPrice)) {
          await alert.trigger(currentPrice);
          triggered++;
          
          console.log(`[CRON] Alert triggered: ${alert.symbol} ${alert.alertType} at ₹${currentPrice}`);
          
          // Here you would send actual notifications (email, SMS, push)
          // For now, just log it
        }
      } catch (err) {
        console.error(`[CRON] Error checking alert ${alert._id}:`, err.message);
      }
    }
    
    console.log(`[CRON] Price alerts check complete. Triggered ${triggered} of ${activeAlerts.length} alerts.`);
  } catch (error) {
    console.error('[CRON] Price alerts check error:', error);
  }
};

// Schedule jobs
const initScheduledJobs = () => {
  // Update prices daily at 6:00 PM IST (market close)
  cron.schedule('0 18 * * 1-5', updateDailyPrices, {
    timezone: 'Asia/Kolkata'
  });
  
  // Create portfolio snapshots daily at 6:30 PM IST (after price update)
  cron.schedule('30 18 * * 1-5', createDailySnapshots, {
    timezone: 'Asia/Kolkata'
  });
  
  // Check price alerts every 5 minutes during market hours (9:15 AM - 3:30 PM IST)
  cron.schedule('*/5 9-15 * * 1-5', checkPriceAlerts, {
    timezone: 'Asia/Kolkata'
  });
  
  // Also check alerts once after market close
  cron.schedule('35 15 * * 1-5', checkPriceAlerts, {
    timezone: 'Asia/Kolkata'
  });
  
  console.log('[CRON] Scheduled jobs initialized:');
  console.log('  - Daily price update: 6:00 PM IST (Mon-Fri)');
  console.log('  - Daily snapshots: 6:30 PM IST (Mon-Fri)');
  console.log('  - Alert checks: Every 5 min, 9:15 AM - 3:30 PM IST (Mon-Fri)');
};

module.exports = {
  initScheduledJobs,
  updateDailyPrices,
  createDailySnapshots,
  checkPriceAlerts
};
