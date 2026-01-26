const Investment = require('../models/Investment');

// @desc    Get all investments for a user
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { userId: req.user._id };
    
    if (type) {
      query.type = type;
    }

    const investments = await Investment.find(query).sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get investment statistics
// @route   GET /api/investments/stats
// @access  Private
const getInvestmentStats = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id });

    const stats = {
      totalInvestment: 0,
      currentValue: 0,
      totalProfit: 0,
      totalLoss: 0,
      byType: {}
    };

    investments.forEach(inv => {
      stats.totalInvestment += inv.amount;
      stats.currentValue += inv.currentValue;
      
      const profitLoss = inv.currentValue - inv.amount;
      if (profitLoss > 0) {
        stats.totalProfit += profitLoss;
      } else {
        stats.totalLoss += Math.abs(profitLoss);
      }

      if (!stats.byType[inv.type]) {
        stats.byType[inv.type] = {
          count: 0,
          totalInvestment: 0,
          currentValue: 0
        };
      }

      stats.byType[inv.type].count++;
      stats.byType[inv.type].totalInvestment += inv.amount;
      stats.byType[inv.type].currentValue += inv.currentValue;
    });

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create new investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const { type, name, amount, currentValue, units, purchaseDate, maturityDate, interestRate, notes } = req.body;

    if (!type || !name || !amount || !currentValue) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const investment = await Investment.create({
      userId: req.user._id,
      type,
      name,
      amount,
      currentValue,
      units,
      purchaseDate,
      maturityDate,
      interestRate,
      notes
    });

    res.status(201).json(investment);
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Private
const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Check ownership
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this investment' });
    }

    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedInvestment);
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Private
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Check ownership
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this investment' });
    }

    await investment.deleteOne();

    res.json({ message: 'Investment removed' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getInvestments,
  getInvestmentStats,
  createInvestment,
  updateInvestment,
  deleteInvestment
};
