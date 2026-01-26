const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/alerts - Get all alerts for the user
router.get('/', alertController.getAlerts);

// POST /api/alerts - Create a new alert
router.post('/', alertController.createAlert);

// POST /api/alerts/from-watchlist - Create alerts from watchlist
router.post('/from-watchlist', alertController.createFromWatchlist);

// POST /api/alerts/check - Check and trigger alerts (manual or cron)
router.post('/check', alertController.checkAlerts);

// PUT /api/alerts/:id - Update an alert
router.put('/:id', alertController.updateAlert);

// DELETE /api/alerts/:id - Delete an alert
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
