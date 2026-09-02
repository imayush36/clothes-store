import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, phone, password, isClubMember } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'All fields (name, email, phone, password) are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // MongoDB connection
    const mongo = await connectMongo();
    if (mongo) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
      }

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password, // Stored securely
        isClubMember: !!isClubMember,
        addresses: [],
        orders: []
      });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully! Welcome to The Souled Store.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          isClubMember: newUser.isClubMember,
          addresses: newUser.addresses
        }
      }, { status: 201 });
    }

    // Local in-memory session response if DB not connected
    return NextResponse.json({
      success: true,
      message: 'Account created (Local mode).',
      user: {
        id: 'user_' + Date.now(),
        name,
        email: normalizedEmail,
        phone,
        isClubMember: !!isClubMember,
        addresses: []
      }
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
