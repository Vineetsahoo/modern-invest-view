const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const PriceQuote = require('../models/PriceQuote');

const positionAccumulator = (transactions) => {
  const positions = new Map();
  const taxLots = new Map(); // Track individual tax lots

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
        fees: 0,
        // Capital gains tracking
        shortTermGains: 0,
        longTermGains: 0,
        taxLots: []
      });
      taxLots.set(symbol, []);
    }
    return positions.get(symbol);
  };

  transactions.forEach((txn) => {
    const symbol = txn.symbol.toUpperCase();
    const pos = getPos(symbol, txn.assetType);
    const lots = taxLots.get(symbol);
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
        
        // Create tax lot
        const lotId = txn.taxLotId || txn._id.toString();
        lots.push({
          lotId,
          symbol,
          qty,
          price,
          fees,
          costBasis: costAdd,
          acquisitionDate: txn.tradeDate,
          remaining: qty
        });
        pos.taxLots = lots;
        break;
      }
      case 'SELL':
      case 'TRANSFER_OUT': {
        let remainingToSell = qty;
        const proceeds = qty * price - fees;
        let totalCost = 0;
        const today = new Date();
        
        // Use tax lots (FIFO by default) to calculate gains
        for (let i = 0; i < lots.length && remainingToSell > 0; i++) {
          const lot = lots[i];
          if (lot.remaining <= 0) continue;
          
          const sellFromLot = Math.min(lot.remaining, remainingToSell);
          const lotCost = (lot.costBasis / lot.qty) * sellFromLot;
          totalCost += lotCost;
          
          // Calculate holding period
          const holdingPeriod = Math.floor((today - new Date(lot.acquisitionDate)) / (1000 * 60 * 60 * 24));
          const isLongTerm = holdingPeriod > 365;
          
          const gain = ((price * sellFromLot) - lotCost);
          
          if (isLongTerm) {
            pos.longTermGains += gain;
          } else {
            pos.shortTermGains += gain;
          }
          
          lot.remaining -= sellFromLot;
          remainingToSell -= sellFromLot;
        }
        
        pos.qty = Math.max(0, pos.qty - qty);
        pos.costBasis = lots.reduce((sum, lot) => sum + (lot.costBasis / lot.qty) * lot.remaining, 0);
        pos.avgCost = pos.qty ? pos.costBasis / pos.qty : 0;
        pos.realizedPnl += proceeds - totalCost - fees;
        pos.fees += fees;
        pos.taxLots = lots.filter(lot => lot.remaining > 0);
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
    fees: 0,
    shortTermGains: 0,
    longTermGains: 0
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
    totals.shortTermGains += p.shortTermGains || 0;
    totals.longTermGains += p.longTermGains || 0;

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
