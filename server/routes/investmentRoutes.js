const express = require('express');
const router = express.Router();
const {
  getInvestments,
  getInvestmentStats,
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.route('/')
  .get(getInvestments)
  .post(createInvestment);

router.get('/stats', getInvestmentStats);

router.route('/:id')
  .put(updateInvestment)
  .delete(deleteInvestment);

module.exports = router;
