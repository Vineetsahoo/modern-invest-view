const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Fetch quote from Alpha Vantage
const fetchAlphaVantageQuote = async (symbol) => {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      },
      timeout: 5000
    });

    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response from Alpha Vantage');
    }

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || 0),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      lastUpdated: quote['07. latest trading day'],
      source: 'ALPHA_VANTAGE'
    };
  } catch (error) {
    console.error(`[ALPHA_VANTAGE] Error fetching ${symbol}:`, error.message);
    throw error;
  }
};

// Fetch historical data from Alpha Vantage
const fetchAlphaVantageHistory = async (symbol, outputsize = 'compact') => {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: outputsize, // 'compact' = 100 days, 'full' = 20 years
        apikey: ALPHA_VANTAGE_API_KEY
      },
      timeout: 10000
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('Invalid response from Alpha Vantage');
    }

    const history = [];
    for (const [date, data] of Object.entries(timeSeries)) {
      history.push({
        date: new Date(date),
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        adjustedClose: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume']),
        source: 'ALPHA_VANTAGE'
      });
    }

    return history.sort((a, b) => a.date - b.date);
  } catch (error) {
    console.error(`[ALPHA_VANTAGE] Error fetching history for ${symbol}:`, error.message);
    throw error;
  }
};

module.exports = {
  fetchAlphaVantageQuote,
  fetchAlphaVantageHistory
};
