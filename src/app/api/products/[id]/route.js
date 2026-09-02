import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { PRODUCTS } from '@/lib/seedData';

function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    colors: row.colors ? (typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors) : [],
    sizes: row.sizes ? (typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes) : [],
    images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images) : row.images) : [],
    originalPrice: row.original_price || row.originalPrice,
    clubPrice: row.club_price || row.clubPrice,
    fandomTag: row.fandom_tag || row.fandomTag,
    fitType: row.fit_type || row.fitType,
    stockStatus: row.stock_status || row.stockStatus,
    tryonType: row.tryon_type || row.tryonType,
    reviewCount: row.review_count || row.reviewCount
  };
}

export async function GET(request, { params }) {
  const { id } = await params;
  const db = getDb();

  return new Promise((resolve) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err || !row) {
        const fallback = PRODUCTS.find(p => p.id === id);
        if (fallback) {
          return resolve(NextResponse.json({ ...fallback, reviews: [] }));
        }
        return resolve(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
      }

      db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [id], (errRev, reviews) => {
        const prod = formatProduct(row);
        prod.reviews = reviews || [];
        resolve(NextResponse.json(prod));
      });
    });
  });
}
