import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // This endpoint should be handled by NextAuth's [...nextauth] route
  // Return a simple response instead of redirecting
  return NextResponse.json({ 
    message: 'Signin endpoint',
    redirect: '/login'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}
