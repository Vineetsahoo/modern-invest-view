const express = require('express');
const router = express.Router({ mergeParams: true });
const importController = require('../controllers/importController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// POST /api/portfolios/:portfolioId/import - Import transactions from CSV
router.post('/', importController.importTransactions);

// GET /api/portfolios/:portfolioId/import/template - Download CSV template
router.get('/template', importController.getCSVTemplate);

module.exports = router;
