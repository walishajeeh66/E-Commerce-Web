import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.redirect(new URL('/login', request.url));
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}
