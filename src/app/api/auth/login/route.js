import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter both email/phone and password.' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    const mongo = await connectMongo();
    if (mongo) {
      const user = await User.findOne({
        $or: [{ email: normalized }, { phone: normalized }]
      });

      if (!user) {
        return NextResponse.json({ error: 'No account found with this email or phone number.' }, { status: 404 });
      }

      if (user.password !== password) {
        return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}! 👻`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isClubMember: user.isClubMember,
          addresses: user.addresses || []
        }
      });
    }

    // Local fallback
    return NextResponse.json({
      success: true,
      message: 'Logged in successfully (Local mode).',
      user: {
        id: 'user_local',
        name: 'Souled Store Fan',
        email: normalized,
        phone: '9876543210',
        isClubMember: true,
        addresses: []
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
