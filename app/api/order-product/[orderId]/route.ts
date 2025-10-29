import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ orderId: string }> }
) {
	try {
		const { orderId } = await params;
		if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });
		const items = await prisma.customer_order_product.findMany({
			where: { customerOrderId: orderId },
			include: { product: true }
		});
		return NextResponse.json(items);
	} catch (error) {
		console.error('Order items GET error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}



