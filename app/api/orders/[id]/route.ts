import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
		const order = await prisma.customer_order.findUnique({
			where: { id },
			include: { products: { include: { product: true } } }
		});
		if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
		return NextResponse.json(order);
	} catch (error) {
		console.error('Order GET error:', error);
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
		const data: any = {};
		if (body?.status) data.status = body.status;
		// Update order
		const updated = await prisma.customer_order.update({ where: { id }, data });
		// Notify user about status change
    try {
      if (updated?.email) {
				const user = await prisma.user.findFirst({ where: { email: updated.email }, select: { id: true } });
				if (user?.id && body?.status) {
          const status: string = String(body.status).toLowerCase();
          const payload = {
            userId: user.id,
            type: 'ORDER_UPDATE' as const,
            priority: 'HIGH' as const,
            metadata: {
              status,
              orderId: id,
            },
          };
          if (status === 'delivered') {
            await prisma.notification.create({
              data: {
                ...payload,
                title: 'Order Delivered',
                message: `Your order #${id} has been successfully delivered. We hope you love your new items!`,
              }
            });
          } else if (status === 'confirmed') {
            await prisma.notification.create({
              data: {
                ...payload,
                title: 'Order Confirmed',
                message: `Great news! Your order #${id} has been confirmed and will be prepared for shipping.`,
              }
            });
          } else {
            await prisma.notification.create({
              data: {
                ...payload,
                title: 'Order Updated',
                message: `Your order #${id} status changed to ${status}.`,
              }
            });
          }
				}
			}
		} catch (e) {
			console.error('Order status notification error:', e);
		}
		return NextResponse.json(updated);
	} catch (error) {
		console.error('Order PUT error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


