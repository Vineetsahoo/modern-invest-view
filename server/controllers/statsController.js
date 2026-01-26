const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const PriceQuote = require('../models/PriceQuote');

const positionAccumulator = (transactions) => {
  const positions = new Map();

  const getPos = (symbol, assetType) => {
    if (!positions.has(symbol)) {
      positions.set(symbol, {
        symbol,
        assetType,
        qty: 0,
        costBasis: 0,
        avgCost: 0,
        realizedPnl: 0,
        income: 0,
        fees: 0
      });
    }
    return positions.get(symbol);
  };

  transactions.forEach((txn) => {
    const symbol = txn.symbol.toUpperCase();
    const pos = getPos(symbol, txn.assetType);
    const qty = Number(txn.qty || 0);
    const price = Number(txn.price || 0);
    const fees = Number(txn.fees || 0);

    switch (txn.type) {
      case 'BUY':
      case 'TRANSFER_IN': {
        const costAdd = qty * price + fees;
        pos.qty += qty;
        pos.costBasis += costAdd;
        pos.avgCost = pos.qty ? pos.costBasis / pos.qty : 0;
        pos.fees += fees;
        break;
      }
      case 'SELL':
      case 'TRANSFER_OUT': {
        const sellQty = Math.min(qty, pos.qty || qty);
        const proceeds = sellQty * price - fees;
        const cost = sellQty * (pos.avgCost || 0);
        pos.qty = Math.max(0, (pos.qty || 0) - sellQty);
        pos.costBasis = pos.qty ? pos.avgCost * pos.qty : 0;
        pos.realizedPnl += proceeds - cost;
        pos.fees += fees;
        break;
      }
      case 'DIVIDEND':
      case 'INTEREST': {
        pos.income += price;
        break;
      }
      case 'FEES': {
        pos.fees += fees || price;
        pos.realizedPnl -= fees || price;
        break;
      }
      default:
        break;
    }
  });

  return Array.from(positions.values()).filter((p) => p.qty > 0 || p.realizedPnl !== 0 || p.income !== 0);
};

const computeCurrentValues = async (positions) => {
  if (!positions.length) return { positionsWithValue: [], byAssetType: {}, totals: { currentValue: 0 } };

  const symbols = positions.map((p) => p.symbol);
  const quotes = await PriceQuote.find({ symbol: { $in: symbols } });
  const quoteMap = quotes.reduce((acc, q) => {
    acc[q.symbol] = q.price;
    return acc;
  }, {});

  const byAssetType = {};
  const totals = {
    invested: 0,
    currentValue: 0,
    unrealizedPnl: 0,
    realizedPnl: 0,
    income: 0,
    fees: 0
  };

  const positionsWithValue = positions.map((p) => {
    const price = quoteMap[p.symbol] || p.avgCost || 0;
    const currentValue = (p.qty || 0) * price;
    const invested = p.costBasis || 0;
    const unrealized = currentValue - invested;

    totals.invested += invested;
    totals.currentValue += currentValue;
    totals.unrealizedPnl += unrealized;
    totals.realizedPnl += p.realizedPnl || 0;
    totals.income += p.income || 0;
    totals.fees += p.fees || 0;

    if (!byAssetType[p.assetType]) {
      byAssetType[p.assetType] = {
        count: 0,
        invested: 0,
        currentValue: 0
      };
    }

    byAssetType[p.assetType].count += 1;
    byAssetType[p.assetType].invested += invested;
    byAssetType[p.assetType].currentValue += currentValue;

    return {
      ...p,
      currentPrice: price,
      currentValue,
      unrealizedPnl: unrealized
    };
  });

  return { positionsWithValue, byAssetType, totals };
};

const getPortfolioStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const transactions = await Transaction.find({ userId: req.user._id, portfolioId: req.params.id });
    const positions = positionAccumulator(transactions);
    const { positionsWithValue, byAssetType, totals } = await computeCurrentValues(positions);

    res.json({
      portfolio: {
        _id: portfolio._id,
        name: portfolio.name,
        baseCurrency: portfolio.baseCurrency,
        cashBalance: portfolio.cashBalance
      },
      totals,
      byAssetType,
      positions: positionsWithValue
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  positionAccumulator,
  computeCurrentValues,
  getPortfolioStats
};
