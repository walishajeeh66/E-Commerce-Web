import { NextRequest, NextResponse } from 'next/server';
// Deprecated local upload route kept for backward compatibility; returns 410

export const runtime = 'nodejs';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Route deprecated. Use /api/upload.' }, { status: 410 });
}


