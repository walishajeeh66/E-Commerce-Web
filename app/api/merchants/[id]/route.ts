import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const merchant = await prisma.merchant.findUnique({ where: { id } });
    if (!merchant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(merchant);
  } catch (error) {
    console.error('Merchant by id API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


