import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, merchant: true }
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Product by id API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Allowlist fields to prevent accidental nested objects/options leaking into Prisma
    const updateDataBase: any = {
      slug: body?.slug,
      title: body?.title,
      mainImage: body?.mainImage,
      price: typeof body?.price === 'number' ? body.price : undefined,
      rating: typeof body?.rating === 'number' ? body.rating : undefined,
      description: body?.description,
      manufacturer: body?.manufacturer,
      inStock: typeof body?.inStock === 'number' ? body.inStock : undefined,
      discountedPrice: typeof body?.discountedPrice === 'number' ? body.discountedPrice : undefined,
    };

    // Remove undefineds
    Object.keys(updateDataBase).forEach((k) => updateDataBase[k] === undefined && delete updateDataBase[k]);

    // Prefer scalar FKs if supported by current Prisma schema; otherwise fallback to nested connect
    const wantsCategoryId = typeof body?.categoryId === 'string' && body.categoryId.length > 0;
    const wantsMerchantId = typeof body?.merchantId === 'string' && body.merchantId.length > 0;

    // First attempt: scalar FKs present in schema
    let updated;
    try {
      const firstAttemptData: any = { ...updateDataBase };
      if (wantsCategoryId) firstAttemptData.categoryId = body.categoryId;
      if (wantsMerchantId) firstAttemptData.merchantId = body.merchantId;
      updated = await prisma.product.update({ where: { id }, data: firstAttemptData });
    } catch (e: any) {
      // Fallback: nested connect style when scalar FKs are not accepted by generated client
      const fallbackData: any = { ...updateDataBase };
      if (wantsCategoryId) fallbackData.category = { connect: { id: body.categoryId } };
      if (wantsMerchantId) fallbackData.merchant = { connect: { id: body.merchantId } };
      updated = await prisma.product.update({ where: { id }, data: fallbackData });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Product update API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Ensure no order items exist for this product
    const count = await prisma.customer_order_product.count({ where: { productId: id } });
    if (count > 0) {
      return NextResponse.json({ error: 'Cannot delete product with existing order items' }, { status: 400 });
    }
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Product delete API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


