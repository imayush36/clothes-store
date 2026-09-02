import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { COUPONS } from '@/lib/seedData';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 });
    }

    const normalized = code.trim().toUpperCase();
    const orderAmount = Number(subtotal) || 0;
    const db = getDb();

    return new Promise((resolve) => {
      db.get('SELECT * FROM coupons WHERE code = ?', [normalized], (err, row) => {
        if (err || !row) {
          const fallback = COUPONS.find(c => c.code === normalized);
          if (!fallback) {
            return resolve(NextResponse.json({ valid: false, message: `Invalid coupon code: "${normalized}"` }, { status: 404 }));
          }

          if (orderAmount < fallback.minOrder) {
            return resolve(NextResponse.json({
              valid: false,
              message: `Minimum order of ₹${fallback.minOrder} required for code "${fallback.code}".`
            }, { status: 400 }));
          }

          let discount = fallback.discountType === 'flat' ? fallback.discountValue : Math.round(orderAmount * fallback.discountValue);
          return resolve(NextResponse.json({
            valid: true,
            code: fallback.code,
            discountType: fallback.discountType,
            discountValue: fallback.discountValue,
            calculatedDiscount: discount,
            message: `🎉 Coupon applied: ${fallback.description}`
          }));
        }

        if (orderAmount < row.min_order) {
          return resolve(NextResponse.json({
            valid: false,
            message: `Minimum order of ₹${row.min_order} required for code "${row.code}".`
          }, { status: 400 }));
        }

        let calculatedDiscount = row.discount_type === 'flat' ? row.discount_value : Math.round(orderAmount * row.discount_value);

        resolve(NextResponse.json({
          valid: true,
          code: row.code,
          discountType: row.discount_type,
          discountValue: row.discount_value,
          calculatedDiscount,
          message: `🎉 Coupon applied: ${row.description}`
        }));
      });
    });
  } catch (e) {
    return NextResponse.json({ valid: false, error: e.message }, { status: 500 });
  }
}
