const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper to format product fields from JSON strings
function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    colors: row.colors ? JSON.parse(row.colors) : [],
    sizes: row.sizes ? JSON.parse(row.sizes) : [],
    images: row.images ? JSON.parse(row.images) : [],
    originalPrice: row.original_price,
    clubPrice: row.club_price,
    fandomTag: row.fandom_tag,
    fitType: row.fit_type,
    stockStatus: row.stock_status,
    tryonType: row.tryon_type,
    reviewCount: row.review_count
  };
}

// GET /api/products (with filtering & sorting)
router.get('/', (req, res) => {
  const { gender, category, fandom, search, maxPrice, sort } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (gender && gender !== 'all') {
    if (gender === 'men') {
      query += ' AND (gender = "men" OR gender IS NULL)';
    } else if (gender === 'women') {
      query += ' AND gender = "women"';
    } else if (gender === 'footwear') {
      query += ' AND category = "footwear"';
    }
  }

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (fandom && fandom !== 'all') {
    query += ' AND fandom = ?';
    params.push(fandom);
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(Number(maxPrice));
  }

  if (search) {
    query += ' AND (name LIKE ? OR category LIKE ? OR fandom LIKE ? OR fandom_tag LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  // Sorting
  if (sort === 'price-low') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price-high') {
    query += ' ORDER BY price DESC';
  } else if (sort === 'rating') {
    query += ' ORDER BY rating DESC';
  } else {
    query += ' ORDER BY id ASC';
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const formatted = rows.map(formatProduct);
    res.json({ count: formatted.length, products: formatted });
  });
});

// GET /api/products/categories
router.get('/meta/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/products/fandoms
router.get('/meta/fandoms', (req, res) => {
  db.all('SELECT * FROM fandoms', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });

    // Also get reviews for this product
    db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [id], (errRev, reviews) => {
      const product = formatProduct(row);
      product.reviews = reviews || [];
      res.json(product);
    });
  });
});

// POST /api/products (Add product)
router.post('/', (req, res) => {
  const p = req.body;
  const id = p.id || 'prod-' + Date.now();

  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, gender, category, fandom, fandom_tag, price, original_price,
      club_price, rating, review_count, badge, fit_type, fabric, stock_status,
      description, colors, sizes, images, tryon_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id, p.name, p.gender || 'men', p.category, p.fandom || 'tss', p.fandomTag || 'TSS Originals',
    p.price, p.originalPrice || p.price, p.clubPrice || p.price, p.rating || 5.0, 0,
    p.badge || 'NEW', p.fitType || 'REGULAR', p.fabric || '100% Cotton', p.stockStatus || 'In Stock',
    p.description || '', JSON.stringify(p.colors || []), JSON.stringify(p.sizes || ['M', 'L', 'XL']),
    JSON.stringify(p.images || []), p.tryonType || 'top',
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Product created successfully', id });
    }
  );
  stmt.finalize();
});

module.exports = router;
