import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, default: 'men' },
  category: { type: String, required: true },
  fandom: { type: String, required: true },
  fandomTag: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  clubPrice: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  badge: { type: String },
  fitType: { type: String },
  fabric: { type: String },
  stockStatus: { type: String, default: 'In Stock' },
  description: { type: String },
  colors: [{ name: String, hex: String, image: String }],
  sizes: [String],
  images: [String],
  tryonType: { type: String, default: 'top' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
