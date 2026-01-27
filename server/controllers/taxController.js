const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// Get tax summary for a portfolio
const getTaxSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const { year } = req.query;
    const financialYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Financial year: April 1 to March 31
    const startDate = new Date(`${financialYear}-04-01`);
    const endDate = new Date(`${financialYear + 1}-03-31`);

    // Get all SELL transactions in the financial year
    const sellTransactions = await Transaction.find({
      userId: req.user._id,
      portfolioId: req.params.id,
      type: 'SELL',
      tradeDate: { $gte: startDate, $lte: endDate }
    }).sort({ tradeDate: 1 });

    let shortTermGains = 0;
    let longTermGains = 0;
    const gainsByAsset = {};

    for (const txn of sellTransactions) {
      // Get all BUY transactions for this symbol before the sell
      const buyTransactions = await Transaction.find({
        userId: req.user._id,
        portfolioId: req.params.id,
        symbol: txn.symbol,
        type: { $in: ['BUY', 'TRANSFER_IN'] },
        tradeDate: { $lte: txn.tradeDate }
      }).sort({ tradeDate: 1 });

      let remainingToSell = txn.qty;
      const sellPrice = txn.price;
      const sellFees = txn.fees || 0;

      for (const buyTxn of buyTransactions) {
        if (remainingToSell <= 0) break;

        const soldQty = Math.min(remainingToSell, buyTxn.qty);
        const costBasis = (buyTxn.price * soldQty) + (buyTxn.fees || 0) * (soldQty / buyTxn.qty);
        const proceeds = sellPrice * soldQty - (sellFees * soldQty / txn.qty);
        const gain = proceeds - costBasis;

        // Calculate holding period
        const holdingDays = Math.floor((txn.tradeDate - buyTxn.tradeDate) / (1000 * 60 * 60 * 24));
        const isLongTerm = holdingDays > 365;

        if (isLongTerm) {
          longTermGains += gain;
        } else {
          shortTermGains += gain;
        }

        // Track by asset type
        if (!gainsByAsset[txn.assetType]) {
          gainsByAsset[txn.assetType] = { shortTerm: 0, longTerm: 0 };
        }
        if (isLongTerm) {
          gainsByAsset[txn.assetType].longTerm += gain;
        } else {
          gainsByAsset[txn.assetType].shortTerm += gain;
        }

        remainingToSell -= soldQty;
      }
    }

    // Get dividend/interest income
    const incomeTransactions = await Transaction.find({
      userId: req.user._id,
      portfolioId: req.params.id,
      type: { $in: ['DIVIDEND', 'INTEREST'] },
      tradeDate: { $gte: startDate, $lte: endDate }
    });

    const dividendIncome = incomeTransactions
      .filter(t => t.type === 'DIVIDEND')
      .reduce((sum, t) => sum + t.price, 0);
    
    const interestIncome = incomeTransactions
      .filter(t => t.type === 'INTEREST')
      .reduce((sum, t) => sum + t.price, 0);

    res.json({
      financialYear: `${financialYear}-${financialYear + 1}`,
      startDate,
      endDate,
      capitalGains: {
        shortTerm: shortTermGains,
        longTerm: longTermGains,
        total: shortTermGains + longTermGains
      },
      income: {
        dividend: dividendIncome,
        interest: interestIncome,
        total: dividendIncome + interestIncome
      },
      byAssetType: gainsByAsset,
      taxEstimates: {
        // Indian tax rates (simplified)
        stcgTax: shortTermGains * 0.15, // 15% STCG on equity
        ltcgTax: Math.max(0, longTermGains - 100000) * 0.10, // 10% LTCG on equity above 1L
        dividendTax: dividendIncome * 0.10, // Dividend taxed at slab rate (example)
        totalEstimatedTax: (shortTermGains * 0.15) + (Math.max(0, longTermGains - 100000) * 0.10)
      }
    });
  } catch (error) {
    console.error('Get tax summary error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getTaxSummary };
