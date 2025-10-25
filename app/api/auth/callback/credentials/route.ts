import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  try {
    // This endpoint is handled by NextAuth's [...nextauth] route
    // But we need it to exist for NextAuth to work properly
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is handled by NextAuth's [...nextauth] route
    // But we need it to exist for NextAuth to work properly
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
