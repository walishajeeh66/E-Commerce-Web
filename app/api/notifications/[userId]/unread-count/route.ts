import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const count = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    console.error('Notifications unread-count API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


