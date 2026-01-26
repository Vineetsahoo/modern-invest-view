const express = require('express');
const router = express.Router();
const { getQuotes } = require('../controllers/quoteController');

// Quotes can be public for now
router.get('/', getQuotes);

module.exports = router;
