const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  listPortfolios,
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');
const { getPortfolioStats } = require('../controllers/statsController');

router.use(protect);

router.route('/')
  .get(listPortfolios)
  .post(createPortfolio);

router.route('/:id')
  .get(getPortfolio)
  .put(updatePortfolio)
  .delete(deletePortfolio);

router.get('/:id/stats', getPortfolioStats);

module.exports = router;
