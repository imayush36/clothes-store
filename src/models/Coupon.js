import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  description: { type: String }
});

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
