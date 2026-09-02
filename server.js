require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Initialize local SQLite
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin__user:SouledStore8520@cluster0.ecxvmlt.mongodb.net/souled_store?retryWrites=true&w=majority&appName=Cluster0';

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('🍃 Connected to MongoDB Atlas successfully!'))
    .catch(err => console.warn('⚠️ MongoDB Atlas note:', err.message));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '.')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'The Souled Store (TSS) E-Commerce API',
    database: {
      mongoAtlas: mongoose.connection.readyState === 1 ? 'Connected (souled_store)' : 'Connecting / Fallback',
      sqlite: 'Active'
    },
    version: '1.0.0'
  });
});

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 The Souled Store is running on http://localhost:${PORT}`);
  console.log(`🍃 Database: MongoDB Atlas (Cluster0) + SQLite Active`);
  console.log(`======================================================\n`);
});
