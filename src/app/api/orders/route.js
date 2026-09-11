import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { getDb } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

function generateTrackingNumber() {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `TSS-${randNum}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerAddress, items, subtotal, discount, finalTotal, paymentMethod } = body;

    if (!customerName || !customerEmail || !customerEmail.includes('@') || !items || items.length === 0) {
      return NextResponse.json({ error: 'Authentication required: Valid registered account name, email, and cart items are required to place an order.' }, { status: 401 });
    }

    const trackingNumber = generateTrackingNumber();

    // Try MongoDB first
    try {
      const mongo = await connectMongo();
      if (mongo) {
        const newOrder = await Order.create({
          trackingNumber,
          customerName,
          customerEmail,
          customerAddress: customerAddress || 'Customer Address',
          items,
          subtotal,
          discount: discount || 0,
          finalTotal,
          paymentMethod: paymentMethod || 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Confirmed'
        });

        return NextResponse.json({
          success: true,
          message: 'Order saved to MongoDB successfully!',
          orderId: newOrder._id,
          trackingNumber,
          db: 'MongoDB',
          orderDetails: {
            customerName,
            customerEmail,
            finalTotal,
            itemsCount: items.length,
            estimatedDelivery: '2–3 Business Days'
          }
        }, { status: 201 });
      }
    } catch (err) {
      console.warn('MongoDB order creation fallback to SQLite:', err.message);
    }

    // SQLite Fallback
    const db = getDb();
    return new Promise((resolve) => {
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
        customerAddress || 'Customer Address',
        JSON.stringify(items),
        subtotal,
        discount || 0,
        finalTotal,
        paymentMethod || 'UPI',
        'Paid',
        'Confirmed',
        function (err) {
          if (err) {
            return resolve(NextResponse.json({
              success: true,
              trackingNumber,
              orderDetails: { customerName, finalTotal }
            }));
          }

          resolve(NextResponse.json({
            success: true,
            message: 'Order placed successfully!',
            orderId: this.lastID,
            trackingNumber,
            db: 'SQLite',
            orderDetails: {
              customerName,
              customerEmail,
              finalTotal,
              itemsCount: items.length,
              estimatedDelivery: '2–3 Business Days'
            }
          }, { status: 201 }));
        }
      );
      stmt.finalize();
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mongo = await connectMongo();
    if (mongo) {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ count: orders.length, orders, db: 'MongoDB' });
    }
  } catch (e) {}

  const db = getDb();
  return new Promise((resolve) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      const formatted = (rows || []).map(r => ({
        ...r,
        items: r.items ? JSON.parse(r.items) : []
      }));
      resolve(NextResponse.json({ count: formatted.length, orders: formatted, db: 'SQLite' }));
    });
  });
}
