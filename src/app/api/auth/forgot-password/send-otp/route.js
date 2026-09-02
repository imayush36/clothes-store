import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// In-memory temporary OTP store: emailOrPhone -> { otp, expiresAt }
global._tssOtpStore = global._tssOtpStore || new Map();

export async function POST(request) {
  try {
    const { emailOrPhone } = await request.json();

    if (!emailOrPhone) {
      return NextResponse.json({ error: 'Please enter your registered Email or Mobile number.' }, { status: 400 });
    }

    const identifier = emailOrPhone.toLowerCase().trim();

    // Verify user exists in MongoDB
    const mongo = await connectMongo();
    let userName = 'Customer';
    if (mongo) {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
      });

      if (!user) {
        return NextResponse.json({ error: 'No account found with this Email or Mobile number.' }, { status: 404 });
      }
      userName = user.name;
    }

    // Generate 6-digit secure numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    global._tssOtpStore.set(identifier, { otp: generatedOtp, expiresAt });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${identifier}!`,
      otp: generatedOtp, // Sent back so frontend simulation alert / toast displays it
      expiresInMinutes: 10,
      userName
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
