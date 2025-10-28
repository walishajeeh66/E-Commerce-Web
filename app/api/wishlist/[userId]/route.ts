import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Wishlist list GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


