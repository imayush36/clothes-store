import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  let mongoStatus = 'Disconnected (Using SQLite)';
  try {
    const mongo = await connectMongo();
    if (mongo) mongoStatus = 'Connected to MongoDB Atlas (User: admin__user, Database: souled_store)';
  } catch (e) {
    mongoStatus = 'Connection Error';
  }

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'The Souled Store Next.js 15 App Router API',
    framework: 'Next.js 15',
    database: {
      primary: 'MongoDB Atlas',
      mongoStatus,
      cluster: 'cluster0.ecxvmlt.mongodb.net'
    }
  });
}
