const PortfolioSnapshot = require('../models/PortfolioSnapshot');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const PriceQuote = require('../models/PriceQuote');

// Import position calculation logic from statsController
const { positionAccumulator, computeCurrentValues } = require('./statsController');

// Create a snapshot of current portfolio state
const createSnapshot = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { snapshotDate = new Date() } = req.body;
    
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Verify ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Get all transactions up to snapshot date
    const transactions = await Transaction.find({
      portfolioId,
      tradeDate: { $lte: new Date(snapshotDate) }
    }).sort({ tradeDate: 1 });
    
    // Calculate positions
    const positions = positionAccumulator(transactions);
    const statsData = await computeCurrentValues(positions);
    
    const date = new Date(snapshotDate);
    date.setHours(0, 0, 0, 0);
    
    // Create snapshot
    const snapshot = await PortfolioSnapshot.findOneAndUpdate(
      {
        portfolioId,
        snapshotDate: {
          $gte: date,
          $lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1)
        }
      },
      {
        userId: req.user._id,
        portfolioId,
        snapshotDate: date,
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
      { upsert: true, new: true }
    );
    
    res.json(snapshot);
  } catch (error) {
    console.error('Error creating snapshot:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get historical snapshots for a portfolio
const getSnapshots = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { startDate, endDate, period = '6M' } = req.query;
    
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Verify ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();
    
    // Calculate start date based on period
    if (!startDate && period) {
      const periodMap = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '3Y': 1095,
        '5Y': 1825
      };
      const days = periodMap[period] || 180;
      start = new Date();
      start.setDate(start.getDate() - days);
    }
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const snapshots = await PortfolioSnapshot.find({
      portfolioId,
      snapshotDate: { $gte: start, $lte: end }
    }).sort({ snapshotDate: 1 });
    
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a snapshot
const deleteSnapshot = async (req, res) => {
  try {
    const { portfolioId, snapshotId } = req.params;
    
    const snapshot = await PortfolioSnapshot.findById(snapshotId);
    if (!snapshot) {
      return res.status(404).json({ error: 'Snapshot not found' });
    }
    
    // Verify ownership
    if (snapshot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await snapshot.deleteOne();
    res.json({ message: 'Snapshot deleted' });
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    res.status(500).json({ error: error.message });
  }
};

// Backfill snapshots for historical data
const backfillSnapshots = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { days = 180 } = req.body;
    
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Verify ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const created = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends (optional)
      // if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Get all transactions up to this date
      const transactions = await Transaction.find({
        portfolioId,
        tradeDate: { $lte: date }
      }).sort({ tradeDate: 1 });
      
      if (transactions.length === 0) continue;
      
      // Calculate positions
      const positions = positionAccumulator(transactions);
      const statsData = await computeCurrentValues(positions);
      
      // Create snapshot
      const snapshot = await PortfolioSnapshot.findOneAndUpdate(
        {
          portfolioId,
          snapshotDate: {
            $gte: date,
            $lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1)
          }
        },
        {
          userId: req.user._id,
          portfolioId,
          snapshotDate: date,
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
        { upsert: true, new: true }
      );
      
      created.push(snapshot);
    }
    
    res.json({
      message: `Created ${created.length} snapshots`,
      count: created.length
    });
  } catch (error) {
    console.error('Error backfilling snapshots:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSnapshot, getSnapshots, deleteSnapshot, backfillSnapshots };
