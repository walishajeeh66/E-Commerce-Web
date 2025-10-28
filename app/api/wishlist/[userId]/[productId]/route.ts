import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string; productId: string }> }
) {
  try {
    const { userId, productId } = await params;
    const item = await prisma.wishlist.findFirst({ where: { userId, productId } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Wishlist item GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; productId: string }> }
) {
  try {
    const { userId, productId } = await params;
    const { exists } = await request.json();
    if (exists) {
      const existing = await prisma.wishlist.findFirst({ where: { userId, productId } });
      if (existing) return NextResponse.json(existing);
      const created = await prisma.wishlist.create({ data: { userId, productId } });
      return NextResponse.json(created);
    } else {
      await prisma.wishlist.deleteMany({ where: { userId, productId } });
      return NextResponse.json({ ok: true });
    }
  } catch (error) {
    console.error('Wishlist item PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


