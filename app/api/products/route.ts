import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Build where clause
    const where: any = {};
    if (category) {
      where.category = { name: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Fetch products with relations
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        merchant: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'desc' }
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
        merchant: true
      }
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
