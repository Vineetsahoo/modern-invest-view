const Portfolio = require('../models/Portfolio');

// Get all portfolios for current user
const listPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    console.error('List portfolios error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create portfolio
const createPortfolio = async (req, res) => {
  try {
    const { name, baseCurrency, cashBalance } = req.body;
    if (!name) return res.status(400).json({ message: 'Portfolio name is required' });

    const portfolio = await Portfolio.create({
      userId: req.user._id,
      name,
      baseCurrency: baseCurrency || 'INR',
      cashBalance: cashBalance || 0
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Create portfolio error:', error);
    const code = error.code === 11000 ? 400 : 500;
    const msg = error.code === 11000 ? 'Portfolio with this name already exists' : (error.message || 'Server error');
    res.status(code).json({ message: msg });
  }
};

// Get single portfolio (owned)
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update portfolio
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name: req.body.name,
        baseCurrency: req.body.baseCurrency,
        cashBalance: req.body.cashBalance
      },
      { new: true, runValidators: true }
    );

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ message: 'Portfolio removed' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  listPortfolios,
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio
};
