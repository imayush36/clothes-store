import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request) {
  try {
    const { productId, userName, rating, comment } = await request.json();
    if (!productId || !userName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const db = getDb();
    return new Promise((resolve) => {
      const stmt = db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)');
      stmt.run(productId, userName, Number(rating), comment, function (err) {
        if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));

        db.run('UPDATE products SET review_count = review_count + 1 WHERE id = ?', [productId]);
        resolve(NextResponse.json({
          success: true,
          message: 'Review submitted successfully!',
          reviewId: this.lastID
        }, { status: 201 }));
      });
      stmt.finalize();
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
