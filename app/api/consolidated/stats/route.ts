import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const [totalOrders, pendingOrders, deliveredOrders, cancelledOrders, revenueAgg] = await Promise.all([
			prisma.customer_order.count(),
			prisma.customer_order.count({ where: { status: 'pending' } }),
			prisma.customer_order.count({ where: { status: 'delivered' } }),
			prisma.customer_order.count({ where: { status: 'cancelled' } }),
			prisma.customer_order.aggregate({ _sum: { total: true } })
		]);
		const totalRevenue = revenueAgg._sum.total || 0;
		const profit = Math.round(totalRevenue * 0.2);
		return NextResponse.json({
			totalOrders,
			pendingOrders,
			deliveredOrders,
			cancelledOrders,
			totalRevenue,
			profit,
			visitorsToday: 0
		});
	} catch (error) {
		console.error('Consolidated stats API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}



