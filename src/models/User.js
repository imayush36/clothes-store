import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  id: { type: String, default: () => 'addr_' + Math.random().toString(36).substr(2, 9) },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  addressType: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isClubMember: { type: Boolean, default: false },
  addresses: [AddressSchema],
  orders: [{ type: String }], // Array of tracking numbers
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
