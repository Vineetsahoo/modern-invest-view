const HistoricalPrice = require('../models/HistoricalPrice');
const PriceQuote = require('../models/PriceQuote');

// Generate mock historical data for a symbol
const generateMockHistory = (symbol, days = 180) => {
  const history = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start with a base price based on symbol hash
  let basePrice = 100;
  for (let i = 0; i < symbol.length; i++) {
    basePrice += symbol.charCodeAt(i) % 50;
  }
  
  let price = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random walk with trend
    const trend = 0.0002; // Slight upward bias
    const volatility = 0.02;
    const change = (Math.random() - 0.5 + trend) * price * volatility;
    price = Math.max(price + change, 1);
    
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const close = price * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000 + 100000);
    
    history.push({
      symbol,
      date,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      adjustedClose: Math.round(close * 100) / 100,
      volume,
      source: 'MOCK',
      currency: 'INR'
    });
  }
  
  return history;
};

// Get historical prices for a symbol
const getHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate, period = '6M' } = req.query;
    
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();
    
    // Calculate start date based on period
    if (!startDate && period) {
      const periodMap = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '3Y': 1095,
        '5Y': 1825
      };
      const days = periodMap[period] || 180;
      start = new Date();
      start.setDate(start.getDate() - days);
    }
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    let history = await HistoricalPrice.find({
      symbol: symbol.toUpperCase(),
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    
    // If no historical data exists, generate mock data
    if (history.length === 0) {
      const mockHistory = generateMockHistory(symbol.toUpperCase(), 180);
      // Save mock data to database
      await HistoricalPrice.insertMany(mockHistory, { ordered: false }).catch(() => {});
      
      // Fetch again with date filter
      history = await HistoricalPrice.find({
        symbol: symbol.toUpperCase(),
        date: { $gte: start, $lte: end }
      }).sort({ date: 1 });
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update/create historical prices for symbols
const updatePrices = async (req, res) => {
  try {
    const { symbols, date = new Date() } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols array required' });
    }
    
    const results = [];
    
    for (const symbol of symbols) {
      // Get current quote
      const quote = await PriceQuote.findOne({ symbol: symbol.toUpperCase() });
      const price = quote?.price || 100;
      
      // Create or update today's historical price
      const priceData = {
        symbol: symbol.toUpperCase(),
        date: new Date(date),
        open: price * (1 + (Math.random() - 0.5) * 0.01),
        high: price * (1 + Math.random() * 0.02),
        low: price * (1 - Math.random() * 0.02),
        close: price,
        adjustedClose: price,
        volume: Math.floor(Math.random() * 1000000 + 100000),
        source: 'MOCK',
        currency: 'INR'
      };
      
      const updated = await HistoricalPrice.findOneAndUpdate(
        { 
          symbol: symbol.toUpperCase(),
          date: {
            $gte: new Date(date).setHours(0, 0, 0, 0),
            $lte: new Date(date).setHours(23, 59, 59, 999)
          }
        },
        priceData,
        { upsert: true, new: true }
      );
      
      results.push(updated);
    }
    
    res.json({ 
      message: `Updated ${results.length} symbols`,
      results 
    });
  } catch (error) {
    console.error('Error updating historical prices:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get latest prices for multiple symbols
const getLatestPrices = async (req, res) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({ error: 'Symbols parameter required' });
    }
    
    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    
    const latestPrices = await Promise.all(
      symbolArray.map(async (symbol) => {
        const latest = await HistoricalPrice.findOne({ symbol })
          .sort({ date: -1 })
          .limit(1);
        return latest || null;
      })
    );
    
    res.json(latestPrices.filter(p => p !== null));
  } catch (error) {
    console.error('Error fetching latest prices:', error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getHistory, updatePrices, getLatestPrices };