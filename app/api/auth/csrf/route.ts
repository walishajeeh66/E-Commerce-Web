import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = Math.random().toString(36).substring(2, 15);
  return NextResponse.json({ csrfToken: token });
}
