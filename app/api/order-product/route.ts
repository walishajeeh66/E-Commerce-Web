import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { customerOrderId, productId, quantity } = await request.json();
    if (!customerOrderId || !productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const created = await prisma.customer_order_product.create({
      data: { customerOrderId, productId, quantity }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Order product POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


