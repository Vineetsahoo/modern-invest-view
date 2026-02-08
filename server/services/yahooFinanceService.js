const axios = require('axios');

const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Fetch quote from Yahoo Finance
const fetchYahooQuote = async (symbol) => {
  try {
    const response = await axios.get(`${YAHOO_FINANCE_BASE_URL}/${symbol}`, {
      params: {
        interval: '1d',
        range: '1d'
      },
      timeout: 5000
    });

    const result = response.data.chart.result[0];
    if (!result || !result.meta) {
      throw new Error('Invalid response from Yahoo Finance');
    }

    const meta = result.meta;
    const quote = result.indicators.quote[0];

    return {
      symbol: symbol.toUpperCase(),
      price: meta.regularMarketPrice || meta.previousClose,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      volume: meta.regularMarketVolume,
      high: quote.high[0] || meta.regularMarketDayHigh,
      low: quote.low[0] || meta.regularMarketDayLow,
      open: quote.open[0] || meta.regularMarketOpen,
      previousClose: meta.previousClose,
      lastUpdated: new Date(meta.regularMarketTime * 1000).toISOString(),
      source: 'YAHOO_FINANCE'
    };
  } catch (error) {
    console.error(`[YAHOO] Error fetching ${symbol}:`, error.message);
    throw error;
  }
};

// Fetch historical data from Yahoo Finance
const fetchYahooHistory = async (symbol, period1, period2) => {
  try {
    const response = await axios.get(`${YAHOO_FINANCE_BASE_URL}/${symbol}`, {
      params: {
        interval: '1d',
        period1: Math.floor(period1.getTime() / 1000),
        period2: Math.floor(period2.getTime() / 1000)
      },
      timeout: 10000
    });

    const result = response.data.chart.result[0];
    if (!result || !result.timestamp) {
      throw new Error('Invalid response from Yahoo Finance');
    }

    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const adjClose = result.indicators.adjclose?.[0]?.adjclose || [];

    const history = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (!quote.close[i]) continue;
      
      history.push({
        date: new Date(timestamps[i] * 1000),
        open: quote.open[i],
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        adjustedClose: adjClose[i] || quote.close[i],
        volume: quote.volume[i],
        source: 'YAHOO_FINANCE'
      });
    }

    return history;
  } catch (error) {
    console.error(`[YAHOO] Error fetching history for ${symbol}:`, error.message);
    throw error;
  }
};

module.exports = {
  fetchYahooQuote,
  fetchYahooHistory
};
