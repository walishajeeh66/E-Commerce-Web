import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        product: true
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, icon } = await request.json();
    
    const category = await prisma.category.create({
      data: {
        name,
        icon
      }
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
