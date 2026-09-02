import { NextResponse } from 'next/server';
import { lookupPincode } from '@/lib/pincodeData';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { pin } = await params;
  const result = lookupPincode(pin);
  return NextResponse.json(result);
}
