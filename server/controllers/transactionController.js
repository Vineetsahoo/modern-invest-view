const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// Ensure portfolio belongs to user
const assertPortfolioOwner = async (userId, portfolioId) => {
  const portfolio = await Portfolio.findOne({ _id: portfolioId, userId });
  return portfolio;
};

// List transactions for a portfolio
const listTransactions = async (req, res) => {
  try {
    const portfolio = await assertPortfolioOwner(req.user._id, req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const txns = await Transaction.find({ userId: req.user._id, portfolioId: req.params.portfolioId })
      .sort({ tradeDate: -1, createdAt: -1 });
    res.json(txns);
  } catch (error) {
    console.error('List transactions error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create transaction
const createTransaction = async (req, res) => {
  try {
    const portfolio = await assertPortfolioOwner(req.user._id, req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const { symbol, assetType, type, qty, price, fees, currency, tradeDate, note } = req.body;
    if (!symbol || !assetType || !type) {
      return res.status(400).json({ message: 'symbol, assetType, and type are required' });
    }

    const txn = await Transaction.create({
      userId: req.user._id,
      portfolioId: req.params.portfolioId,
      symbol,
      assetType,
      type,
      qty: qty ?? 0,
      price: price ?? 0,
      fees: fees ?? 0,
      currency: currency || portfolio.baseCurrency || 'INR',
      tradeDate: tradeDate || Date.now(),
      note
    });

    res.status(201).json(txn);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const portfolio = await assertPortfolioOwner(req.user._id, req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, portfolioId: req.params.portfolioId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json(txn);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const portfolio = await assertPortfolioOwner(req.user._id, req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const txn = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id, portfolioId: req.params.portfolioId });
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
