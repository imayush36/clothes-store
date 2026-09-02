import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

global._tssOtpStore = global._tssOtpStore || new Map();

export async function POST(request) {
  try {
    const { emailOrPhone, otp, newPassword } = await request.json();

    if (!emailOrPhone || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields (Email/Phone, OTP, New Password) are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const identifier = emailOrPhone.toLowerCase().trim();
    const storedRecord = global._tssOtpStore.get(identifier);

    // Verify OTP
    if (!storedRecord) {
      return NextResponse.json({ error: 'No active OTP request found. Please request a new OTP.' }, { status: 400 });
    }

    if (Date.now() > storedRecord.expiresAt) {
      global._tssOtpStore.delete(identifier);
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (storedRecord.otp.trim() !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid OTP. Please check and try again.' }, { status: 400 });
    }

    // Clear used OTP
    global._tssOtpStore.delete(identifier);

    // Update password in MongoDB Atlas
    const mongo = await connectMongo();
    if (mongo) {
      const updatedUser = await User.findOneAndUpdate(
        { $or: [{ email: identifier }, { phone: identifier }] },
        { $set: { password: newPassword } },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json({ error: 'User account not found to update password.' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! You can now login with your new password.',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully (Local mode).'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
