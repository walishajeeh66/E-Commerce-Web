import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.customer_order_product.findMany({ include: { product: true, customerOrder: true } });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Order product API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


