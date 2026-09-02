const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'clothes.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    // 1. Categories Table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        tag TEXT
      )
    `);

    // 2. Fandoms Table
    db.run(`
      CREATE TABLE IF NOT EXISTS fandoms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tag TEXT,
        color TEXT
      )
    `);

    // 3. Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        gender TEXT DEFAULT 'men',
        category TEXT NOT NULL,
        fandom TEXT NOT NULL,
        fandom_tag TEXT,
        price INTEGER NOT NULL,
        original_price INTEGER,
        club_price INTEGER NOT NULL,
        rating REAL DEFAULT 4.8,
        review_count INTEGER DEFAULT 0,
        badge TEXT,
        fit_type TEXT,
        fabric TEXT,
        stock_status TEXT DEFAULT 'In Stock',
        description TEXT,
        colors TEXT, -- JSON string
        sizes TEXT,  -- JSON string
        images TEXT, -- JSON string
        tryon_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        items TEXT NOT NULL, -- JSON string array of items
        subtotal INTEGER NOT NULL,
        discount INTEGER DEFAULT 0,
        final_total INTEGER NOT NULL,
        payment_method TEXT DEFAULT 'UPI',
        payment_status TEXT DEFAULT 'Paid',
        order_status TEXT DEFAULT 'Confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Reviews Table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // 6. Coupons Table
    db.run(`
      CREATE TABLE IF NOT EXISTS coupons (
        code TEXT PRIMARY KEY,
        discount_type TEXT NOT NULL, -- 'flat' or 'percent'
        discount_value REAL NOT NULL,
        min_order INTEGER DEFAULT 0,
        description TEXT
      )
    `);

    // Auto seed database if empty
    require('./seed')(db);
  });
}

module.exports = db;
