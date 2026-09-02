const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/reviews/:productId
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [productId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: rows.length, reviews: rows });
  });
});

// POST /api/reviews
router.post('/', (req, res) => {
  const { productId, userName, rating, comment } = req.body;

  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const stmt = db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)');
  stmt.run(productId, userName, Number(rating), comment, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Update review count on the product
    db.run('UPDATE products SET review_count = review_count + 1 WHERE id = ?', [productId]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      reviewId: this.lastID
    });
  });
  stmt.finalize();
});

module.exports = router;
