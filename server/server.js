require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const historicalPriceRoutes = require('./routes/historicalPriceRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Scheduled jobs
const { initScheduledJobs } = require('./jobs/scheduledJobs');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (avoid noisy undefined on GET)
app.use((req, res, next) => {
  const parts = [`${req.method} ${req.path}`];
  if (Object.keys(req.query || {}).length) parts.push(`query=${JSON.stringify(req.query)}`);
  if (req.method !== 'GET' && Object.keys(req.body || {}).length) parts.push(`body=${JSON.stringify(req.body)}`);
  console.log(parts.join(' '));
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/portfolios/:portfolioId/transactions', transactionRoutes);
app.use('/api/portfolios/:portfolioId/snapshots', snapshotRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/prices', historicalPriceRoutes);
app.use('/api/alerts', alertRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  
  // Initialize scheduled jobs
  initScheduledJobs();
});
