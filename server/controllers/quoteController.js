const PriceQuote = require('../models/PriceQuote');
const { fetchYahooQuote } = require('../services/yahooFinanceService');
const { fetchAlphaVantageQuote } = require('../services/alphaVantageService');

// Simple deterministic mock price generator (fallback)
const mockPrice = (symbol) => {
  const base = symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Math.max(10, (base % 200) + 50);
};

// Fetch real-time quote from external API (Yahoo or Alpha Vantage)
const fetchRealQuote = async (symbol) => {
  try {
    // Try Yahoo Finance first (free, no API key needed)
    try {
      const quote = await fetchYahooQuote(symbol);
      return {
        symbol: symbol.toUpperCase(),
        price: quote.price,
        currency: 'USD', // Yahoo returns USD, convert if needed
        source: quote.source,
        metadata: {
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          high: quote.high,
          low: quote.low,
          open: quote.open
        }
      };
    } catch (yahooError) {
      console.log(`[QUOTE] Yahoo failed for ${symbol}, trying Alpha Vantage...`);
      
      // Fallback to Alpha Vantage if Yahoo fails
      if (process.env.ALPHA_VANTAGE_API_KEY) {
        const quote = await fetchAlphaVantageQuote(symbol);
        return {
          symbol: symbol.toUpperCase(),
          price: quote.price,
          currency: 'USD',
          source: quote.source,
          metadata: {
            change: quote.change,
            changePercent: quote.changePercent,
            volume: quote.volume,
            high: quote.high,
            low: quote.low,
            open: quote.open
          }
        };
      }
      
      throw yahooError;
    }
  } catch (error) {
    console.error(`[QUOTE] All external APIs failed for ${symbol}, using mock price`);
    return {
      symbol: symbol.toUpperCase(),
      price: mockPrice(symbol),
      currency: 'INR',
      source: 'MOCK'
    };
  }
};

const getQuotes = async (req, res) => {
  try {
    const symbolsParam = req.query.symbols || '';
    const useRealData = req.query.real === 'true'; // Enable real data with ?real=true
    const symbols = symbolsParam.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
    
    if (!symbols.length) {
      return res.status(400).json({ message: 'symbols query param is required' });
    }

    const result = [];

    for (const symbol of symbols) {
      // Check cache first
      const cached = await PriceQuote.findOne({ symbol });
      const cacheAge = cached ? Date.now() - new Date(cached.asOf).getTime() : Infinity;
      const cacheMaxAge = 5 * 60 * 1000; // 5 minutes

      // Use cache if fresh enough and not requesting real data
      if (cached && cacheAge < cacheMaxAge && !useRealData) {
        result.push({
          symbol: cached.symbol,
          price: cached.price,
          currency: cached.currency,
          asOf: cached.asOf,
          source: cached.source
        });
        continue;
      }

      // Fetch fresh quote
      let quoteData;
      if (useRealData) {
        quoteData = await fetchRealQuote(symbol);
      } else {
        quoteData = {
          symbol,
          price: mockPrice(symbol),
          currency: 'INR',
          source: 'MOCK'
        };
      }

      // Update database
      const updated = await PriceQuote.findOneAndUpdate(
        { symbol },
        { 
          ...quoteData,
          asOf: new Date()
        },
        { upsert: true, new: true }
      );

      result.push({
        symbol: updated.symbol,
        price: updated.price,
        currency: updated.currency,
        asOf: updated.asOf,
        source: updated.source
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getQuotes };
