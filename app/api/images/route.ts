import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      const images = await prisma.image.findMany({
        where: { productID: productId }
      });
      return NextResponse.json(images);
    } else {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Images API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productID, image } = await request.json();
    
    const imageRecord = await prisma.image.create({
      data: {
        productID,
        image
      }
    });
    
    return NextResponse.json(imageRecord);
  } catch (error) {
    console.error('Images API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
