import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error') || 'default';
  return NextResponse.json({ error });
}
