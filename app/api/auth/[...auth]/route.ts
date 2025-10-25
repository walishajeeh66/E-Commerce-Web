import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Handle different auth endpoints
  if (pathname.includes('/providers')) {
    return NextResponse.json({
      credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials"
      }
    });
  }
  
  if (pathname.includes('/error')) {
    const error = url.searchParams.get('error') || 'default';
    return NextResponse.json({ error });
  }
  
  if (pathname.includes('/session')) {
    const session = await getServerSession(authOptions);
    return NextResponse.json(session);
  }
  
  // Default response for any other auth endpoint
  return NextResponse.json({ message: 'Auth endpoint', pathname });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.includes('/_log')) {
    return NextResponse.json({ success: true, message: 'Log recorded' });
  }
  
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
