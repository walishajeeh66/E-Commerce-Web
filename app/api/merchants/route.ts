import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(merchants);
  } catch (error) {
    console.error('Merchants API Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, email, phone, address, status } = await request.json();
    
    const merchant = await prisma.merchant.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        status: status || 'active'
      }
    });
    
    return NextResponse.json(merchant);
  } catch (error) {
    console.error('Merchants API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
