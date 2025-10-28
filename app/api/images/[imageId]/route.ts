import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const image = await prisma.image.findUnique({ where: { imageID: imageId } });
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(image);
  } catch (error) {
    console.error('Image by id API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


