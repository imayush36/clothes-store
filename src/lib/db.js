import sqlite3 from 'sqlite3';
import path from 'path';
import { PRODUCTS, CATEGORIES, FANDOMS, COUPONS } from './seedData';

const dbPath = path.resolve(process.cwd(), 'clothes.db');

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to SQLite in Next.js:', err.message);
      } else {
        initSchema(dbInstance);
      }
    });
  }
  return dbInstance;
}

function initSchema(db) {
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
        colors TEXT,
        sizes TEXT,
        images TEXT,
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
        items TEXT NOT NULL,
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
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order INTEGER DEFAULT 0,
        description TEXT
      )
    `);

    // Check & Seed
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && row && row.count === 0) {
        console.log('🌱 Seeding SQLite database for Next.js...');
        
        const insertCat = db.prepare('INSERT INTO categories (id, name, image, tag) VALUES (?, ?, ?, ?)');
        CATEGORIES.forEach(c => insertCat.run(c.id, c.name, c.image, c.tag));
        insertCat.finalize();

        const insertFandom = db.prepare('INSERT INTO fandoms (id, name, tag, color) VALUES (?, ?, ?, ?)');
        FANDOMS.forEach(f => insertFandom.run(f.id, f.name, f.tag, f.color));
        insertFandom.finalize();

        const insertCoupon = db.prepare('INSERT INTO coupons (code, discount_type, discount_value, min_order, description) VALUES (?, ?, ?, ?, ?)');
        COUPONS.forEach(cp => insertCoupon.run(cp.code, cp.discountType, cp.discountValue, cp.minOrder, cp.description));
        insertCoupon.finalize();

        const insertProd = db.prepare(`
          INSERT INTO products (
            id, name, gender, category, fandom, fandom_tag, price, original_price,
            club_price, rating, review_count, badge, fit_type, fabric, stock_status,
            description, colors, sizes, images, tryon_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        PRODUCTS.forEach(p => {
          insertProd.run(
            p.id, p.name, p.gender, p.category, p.fandom, p.fandomTag, p.price,
            p.originalPrice, p.clubPrice, p.rating, p.reviewCount, p.badge,
            p.fitType, p.fabric, p.stockStatus, p.description, JSON.stringify(p.colors),
            JSON.stringify(p.sizes), JSON.stringify(p.images), p.tryonType
          );
        });
        insertProd.finalize();

        const insertRev = db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)');
        insertRev.run('prod-01', 'Rohan V.', 5, 'Quality is unmatched! Heavyweight 240 GSM cotton feels super premium.');
        insertRev.run('prod-01', 'Siddharth M.', 5, 'The Itachi graphic is crisp. Survived 3 washes with zero peeling!');
        insertRev.run('prod-02', 'Aditya K.', 5, 'Subtle shade, thick collar that holds shape, definitely getting another color.');
        insertRev.finalize();
      }
    });
  });
}
