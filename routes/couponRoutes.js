const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
  }

  const normalized = code.trim().toUpperCase();

  db.get('SELECT * FROM coupons WHERE code = ?', [normalized], (err, row) => {
    if (err) return res.status(500).json({ valid: false, error: err.message });
    if (!row) {
      return res.status(404).json({ valid: false, message: `Invalid coupon code: "${normalized}"` });
    }

    const orderAmount = Number(subtotal) || 0;
    if (orderAmount < row.min_order) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order of ₹${row.min_order} required to use code "${row.code}".`
      });
    }

    let calculatedDiscount = 0;
    if (row.discount_type === 'flat') {
      calculatedDiscount = row.discount_value;
    } else if (row.discount_type === 'percent') {
      calculatedDiscount = Math.round(orderAmount * row.discount_value);
    }

    res.json({
      valid: true,
      code: row.code,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      calculatedDiscount,
      message: `🎉 Coupon applied: ${row.description}`
    });
  });
});

// GET /api/coupons (List all coupons)
router.get('/', (req, res) => {
  db.all('SELECT * FROM coupons', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
