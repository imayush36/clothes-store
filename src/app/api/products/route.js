import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { getDb } from '@/lib/db';
import Product from '@/models/Product';
import { PRODUCTS } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get('gender');
  const category = searchParams.get('category');
  const fandom = searchParams.get('fandom');
  const search = searchParams.get('search');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');

  // Try MongoDB first
  try {
    const mongo = await connectMongo();
    if (mongo) {
      const filter = {};
      if (gender && gender !== 'all') {
        if (gender === 'men') filter.gender = { $in: ['men', null] };
        else if (gender === 'women') filter.gender = 'women';
        else if (gender === 'footwear') filter.category = 'footwear';
      }
      if (category && category !== 'all') filter.category = category;
      if (fandom && fandom !== 'all') filter.fandom = fandom;
      if (maxPrice) filter.price = { $lte: Number(maxPrice) };
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { fandom: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { id: 1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      else if (sort === 'price-high') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };

      const mongoProducts = await Product.find(filter).sort(sortOption).lean();
      if (mongoProducts && mongoProducts.length > 0) {
        return NextResponse.json({ count: mongoProducts.length, products: mongoProducts, source: 'mongodb' });
      }
    }
  } catch (err) {
    console.warn('MongoDB query fallback to SQLite:', err.message);
  }

  // SQLite Fallback
  const db = getDb();
  return new Promise((resolve) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (gender && gender !== 'all') {
      if (gender === 'men') query += ' AND (gender = "men" OR gender IS NULL)';
      else if (gender === 'women') query += ' AND gender = "women"';
      else if (gender === 'footwear') query += ' AND category = "footwear"';
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
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    if (sort === 'price-low') query += ' ORDER BY price ASC';
    else if (sort === 'price-high') query += ' ORDER BY price DESC';
    else if (sort === 'rating') query += ' ORDER BY rating DESC';
    else query += ' ORDER BY id ASC';

    db.all(query, params, (err, rows) => {
      if (err || !rows || rows.length === 0) {
        return resolve(NextResponse.json({ count: PRODUCTS.length, products: PRODUCTS, source: 'fallback' }));
      }
      const formatted = rows.map(formatProduct);
      resolve(NextResponse.json({ count: formatted.length, products: formatted, source: 'sqlite' }));
    });
  });
}
