const express = require('express');
const router = express.Router({ mergeParams: true });
const taxController = require('../controllers/taxController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/portfolios/:id/tax-summary - Get tax summary for financial year
router.get('/', taxController.getTaxSummary);

module.exports = router;
