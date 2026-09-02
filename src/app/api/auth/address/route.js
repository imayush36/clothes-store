import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { userId, email, address } = await request.json();

    if (!address || !address.pincode || !address.houseNo || !address.street || !address.city || !address.state) {
      return NextResponse.json({ error: 'Please fill in all address fields.' }, { status: 400 });
    }

    const newAddress = {
      id: 'addr_' + Date.now(),
      fullName: address.fullName || 'Customer',
      phone: address.phone || '9876543210',
      pincode: address.pincode,
      houseNo: address.houseNo,
      street: address.street,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      addressType: address.addressType || 'HOME',
      isDefault: !!address.isDefault
    };

    const mongo = await connectMongo();
    if (mongo && (userId || email)) {
      const query = userId ? { _id: userId } : { email: email.toLowerCase().trim() };
      
      if (newAddress.isDefault) {
        await User.updateOne(query, { $set: { 'addresses.$[].isDefault': false } });
      }

      const updatedUser = await User.findOneAndUpdate(
        query,
        { $push: { addresses: newAddress } },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Delivery address saved successfully!',
        address: newAddress,
        addresses: updatedUser ? updatedUser.addresses : [newAddress]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Address saved locally.',
      address: newAddress,
      addresses: [newAddress]
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
