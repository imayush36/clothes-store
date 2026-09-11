const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper to generate tracking ID
function generateTrackingNumber() {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `TSS-${randNum}`;
}

// POST /api/orders (Place Order)
router.post('/', (req, res) => {
  const { customerName, customerEmail, customerAddress, items, subtotal, discount, finalTotal, paymentMethod } = req.body;

  if (!customerName || !customerEmail || !customerEmail.includes('@') || !customerAddress || !items || items.length === 0) {
    return res.status(401).json({ error: 'Authentication required: User account details are required to place an order' });
  }

  const trackingNumber = generateTrackingNumber();

  const stmt = db.prepare(`
    INSERT INTO orders (
      tracking_number, customer_name, customer_email, customer_address,
      items, subtotal, discount, final_total, payment_method, payment_status, order_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    trackingNumber,
    customerName,
    customerEmail,
    customerAddress,
    JSON.stringify(items),
    subtotal,
    discount || 0,
    finalTotal,
    paymentMethod || 'UPI',
    'Paid',
    'Confirmed',
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save order: ' + err.message });
      }

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        orderId: this.lastID,
        trackingNumber,
        orderDetails: {
          customerName,
          customerEmail,
          finalTotal,
          itemsCount: items.length,
          estimatedDelivery: '2–3 Business Days'
        }
      });
    }
  );
  stmt.finalize();
});

// GET /api/orders/track/:trackingNumber
router.get('/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const normalized = trackingNumber.trim().toUpperCase();

  db.get('SELECT * FROM orders WHERE tracking_number = ?', [normalized], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      return res.status(404).json({ error: `No order found with Tracking ID: ${normalized}` });
    }

    const items = row.items ? JSON.parse(row.items) : [];

    res.json({
      trackingNumber: row.tracking_number,
      customerName: row.customer_name,
      orderStatus: row.order_status,
      paymentMethod: row.payment_method,
      finalTotal: row.final_total,
      createdAt: row.created_at,
      items,
      timeline: [
        { title: 'Order Placed & Verified', time: row.created_at, status: 'done', desc: 'Order received at Mumbai Central Warehouse' },
        { title: 'Packed & Quality Inspected', time: 'Completed', status: 'done', desc: 'Passed 240 GSM weight & double-stitch test' },
        { title: 'Dispatched via BlueDart Express', time: 'In Transit', status: 'active', desc: 'Air cargo package in transit' },
        { title: 'Out for Delivery', time: 'Expected in 2 Days', status: 'pending', desc: 'Delivery by courier executive' }
      ]
    });
  });
});

// GET /api/orders (List all orders)
router.get('/', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = rows.map(r => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : []
    }));
    res.json({ count: formatted.length, orders: formatted });
  });
});

module.exports = router;
