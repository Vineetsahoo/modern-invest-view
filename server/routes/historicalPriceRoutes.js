const express = require('express');
const router = express.Router();
const historicalPriceController = require('../controllers/historicalPriceController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/prices/:symbol/history - Get historical prices for a symbol
router.get('/:symbol/history', historicalPriceController.getHistory);

// GET /api/prices/latest - Get latest prices for multiple symbols
router.get('/latest', historicalPriceController.getLatestPrices);

// POST /api/prices/update - Update historical prices (admin/cron job)
router.post('/update', historicalPriceController.updatePrices);

module.exports = router;
