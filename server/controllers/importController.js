const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Papa = require('papaparse');

// Parse CSV and create transactions
const importTransactions = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { csvData, mapping } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }

    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Parse CSV
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({ 
        error: 'CSV parsing error',
        details: parsed.errors 
      });
    }

    const rows = parsed.data;
    const transactions = [];
    const errors = [];

    // Default column mapping (can be customized)
    const columnMap = mapping || {
      symbol: 'Symbol',
      assetType: 'Asset Type',
      type: 'Type',
      qty: 'Quantity',
      price: 'Price',
      fees: 'Fees',
      tradeDate: 'Trade Date',
      note: 'Note'
    };

    rows.forEach((row, index) => {
      try {
        const symbol = row[columnMap.symbol]?.trim().toUpperCase();
        const assetTypeRaw = row[columnMap.assetType]?.trim().toUpperCase();
        const typeRaw = row[columnMap.type]?.trim().toUpperCase();
        const qty = parseFloat(row[columnMap.qty] || 0);
        const price = parseFloat(row[columnMap.price] || 0);
        const fees = parseFloat(row[columnMap.fees] || 0);
        const tradeDateStr = row[columnMap.tradeDate]?.trim();
        const note = row[columnMap.note]?.trim() || '';

        // Validate required fields
        if (!symbol) {
          throw new Error('Symbol is required');
        }

        // Map asset type
        const assetTypeMapping = {
          'STOCK': 'EQUITY',
          'EQUITY': 'EQUITY',
          'ETF': 'ETF',
          'REIT': 'REIT',
          'MUTUAL FUND': 'MF',
          'MF': 'MF',
          'FD': 'FD',
          'FIXED DEPOSIT': 'FD',
          'SGB': 'SGB',
          'GOLD BOND': 'SGB',
          'NPS': 'NPS',
          'CRYPTO': 'CRYPTO',
          'CRYPTOCURRENCY': 'CRYPTO'
        };

        const assetType = assetTypeMapping[assetTypeRaw] || 'EQUITY';

        // Map transaction type
        const typeMapping = {
          'BUY': 'BUY',
          'PURCHASE': 'BUY',
          'SELL': 'SELL',
          'SALE': 'SELL',
          'DIVIDEND': 'DIVIDEND',
          'DIV': 'DIVIDEND',
          'INTEREST': 'INTEREST',
          'INT': 'INTEREST',
          'FEES': 'FEES',
          'FEE': 'FEES',
          'TRANSFER IN': 'TRANSFER_IN',
          'TRANSFER OUT': 'TRANSFER_OUT'
        };

        const type = typeMapping[typeRaw] || 'BUY';

        // Parse date
        let tradeDate = new Date();
        if (tradeDateStr) {
          const parsedDate = new Date(tradeDateStr);
          if (!isNaN(parsedDate.getTime())) {
            tradeDate = parsedDate;
          }
        }

        transactions.push({
          userId: req.user._id,
          portfolioId,
          symbol,
          assetType,
          type,
          qty,
          price,
          fees,
          tradeDate,
          note,
          taxMethod: 'FIFO'
        });
      } catch (error) {
        errors.push({
          row: index + 2, // +2 for header and 0-index
          data: row,
          error: error.message
        });
      }
    });

    if (errors.length > 0 && transactions.length === 0) {
      return res.status(400).json({
        error: 'Failed to parse any transactions',
        errors
      });
    }

    // Insert transactions
    const inserted = await Transaction.insertMany(transactions, { ordered: false });

    res.json({
      message: `Successfully imported ${inserted.length} transactions`,
      imported: inserted.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Import transactions error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get CSV template
const getCSVTemplate = (req, res) => {
  const template = `Symbol,Asset Type,Type,Quantity,Price,Fees,Trade Date,Note
AAPL,EQUITY,BUY,10,150.50,10.00,2024-01-15,Apple stock purchase
MSFT,EQUITY,SELL,5,380.20,8.50,2024-02-20,Microsoft sale
RELIANCE.NS,EQUITY,DIVIDEND,0,500.00,0,2024-03-10,Dividend payment
NIFTYBEES,ETF,BUY,100,250.30,15.00,2024-01-20,Nifty ETF
EMBASSY,REIT,BUY,5,350.00,5.00,2024-02-01,Embassy REIT`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=transaction_template.csv');
  res.send(template);
};

module.exports = {
  importTransactions,
  getCSVTemplate
};
