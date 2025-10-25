import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Handle different auth endpoints
  if (pathname.includes('/signin')) {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (pathname.includes('/signout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (pathname.includes('/csrf')) {
    const token = Math.random().toString(36).substring(2, 15);
    return NextResponse.json({ csrfToken: token });
  }
  
  if (pathname.includes('/error')) {
    const error = url.searchParams.get('error') || 'default';
    return NextResponse.json({ error });
  }
  
  return NextResponse.json({ error: 'Auth endpoint not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.includes('/signin') || pathname.includes('/signout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
