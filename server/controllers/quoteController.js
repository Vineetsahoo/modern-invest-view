const PriceQuote = require('../models/PriceQuote');

// Simple deterministic mock price generator
const mockPrice = (symbol) => {
  const base = symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Math.max(10, (base % 200) + 50);
};

const getQuotes = async (req, res) => {
  try {
    const symbolsParam = req.query.symbols || '';
    const symbols = symbolsParam.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
    if (!symbols.length) return res.status(400).json({ message: 'symbols query param is required' });

    const existing = await PriceQuote.find({ symbol: { $in: symbols } });
    const quoteMap = existing.reduce((acc, q) => {
      acc[q.symbol] = q;
      return acc;
    }, {});

    // Generate and upsert missing quotes
    const missing = symbols.filter((s) => !quoteMap[s]);
    if (missing.length) {
      const newQuotes = missing.map((sym) => ({ symbol: sym, price: mockPrice(sym), currency: 'INR', source: 'mock' }));
      const inserted = await PriceQuote.insertMany(newQuotes);
      inserted.forEach((q) => { quoteMap[q.symbol] = q; });
    }

    const result = symbols.map((sym) => ({
      symbol: sym,
      price: quoteMap[sym].price,
      currency: quoteMap[sym].currency,
      asOf: quoteMap[sym].asOf
    }));

    res.json(result);
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getQuotes };
