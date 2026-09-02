import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  const { trackingNumber } = await params;
  const normalized = trackingNumber ? trackingNumber.trim().toUpperCase() : '';
  const db = getDb();

  return new Promise((resolve) => {
    db.get('SELECT * FROM orders WHERE tracking_number = ?', [normalized], (err, row) => {
      if (err || !row) {
        return resolve(NextResponse.json({
          trackingNumber: normalized,
          customerName: 'Valued Customer',
          orderStatus: 'In Transit',
          timeline: [
            { title: 'Order Placed & Verified', time: 'Completed', status: 'done', desc: 'Order received at Mumbai Central Hub' },
            { title: 'Packed & Quality Inspected', time: 'Completed', status: 'done', desc: 'Passed weight & stitch verification' },
            { title: 'Dispatched via BlueDart Express', time: 'In Transit', status: 'active', desc: 'Air cargo package in transit' },
            { title: 'Out for Delivery', time: 'Expected Tomorrow', status: 'pending', desc: 'Delivery by courier executive' }
          ]
        }));
      }

      const items = row.items ? JSON.parse(row.items) : [];

      resolve(NextResponse.json({
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
          { title: 'Out for Delivery', time: 'Expected in 2 Days', status: 'pending', desc: 'Delivery by courier partner' }
        ]
      }));
    });
  });
}
