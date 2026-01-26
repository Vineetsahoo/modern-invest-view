const Watchlist = require('../models/Watchlist');

// List watchlist items for user
const listWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('List watchlist error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Add watchlist item
const addWatchlistItem = async (req, res) => {
  try {
    const { symbol, note, targetPrice, stopPrice, currency } = req.body;
    if (!symbol) return res.status(400).json({ message: 'Symbol is required' });

    const item = await Watchlist.findOneAndUpdate(
      { userId: req.user._id, symbol: symbol.toUpperCase() },
      {
        userId: req.user._id,
        symbol: symbol.toUpperCase(),
        note,
        targetPrice,
        stopPrice,
        currency: currency || 'INR'
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(item);
  } catch (error) {
    console.error('Add watchlist error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update watchlist item
const updateWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
    res.json(item);
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete watchlist item
const deleteWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
    res.json({ message: 'Watchlist item removed' });
  } catch (error) {
    console.error('Delete watchlist error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  listWatchlist,
  addWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
};
