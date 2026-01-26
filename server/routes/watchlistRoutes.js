const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  listWatchlist,
  addWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
} = require('../controllers/watchlistController');

router.use(protect);

router.route('/')
  .get(listWatchlist)
  .post(addWatchlistItem);

router.route('/:id')
  .put(updateWatchlistItem)
  .delete(deleteWatchlistItem);

module.exports = router;
