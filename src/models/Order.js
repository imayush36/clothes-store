import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number,
    image: String
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { type: String, default: 'Paid' },
  orderStatus: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
