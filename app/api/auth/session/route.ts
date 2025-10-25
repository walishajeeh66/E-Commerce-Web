import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session endpoint called, session:", session);
    return NextResponse.json({
      session: session,
      timestamp: new Date().toISOString(),
      debug: {
        hasSession: !!session,
        hasUser: !!(session as any)?.user,
        userRole: (session as any)?.user?.role,
        userId: (session as any)?.user?.id
      }
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ 
      error: "Session error",
      details: error.message 
    }, { status: 500 });
  }
}
