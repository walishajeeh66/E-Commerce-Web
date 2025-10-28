import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
    const images = await prisma.image.findMany({ where: { productID: productId } });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Product images GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


