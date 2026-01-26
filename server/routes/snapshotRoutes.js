const express = require('express');
const router = express.Router({ mergeParams: true });
const snapshotController = require('../controllers/snapshotController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/portfolios/:portfolioId/snapshots - Get historical snapshots
router.get('/', snapshotController.getSnapshots);

// POST /api/portfolios/:portfolioId/snapshots - Create a snapshot
router.post('/', snapshotController.createSnapshot);

// POST /api/portfolios/:portfolioId/snapshots/backfill - Backfill historical snapshots
router.post('/backfill', snapshotController.backfillSnapshots);

// DELETE /api/portfolios/:portfolioId/snapshots/:snapshotId - Delete a snapshot
router.delete('/:snapshotId', snapshotController.deleteSnapshot);

module.exports = router;
