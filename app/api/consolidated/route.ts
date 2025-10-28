import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  try {
    switch (endpoint) {
      case 'hero': {
        // Pick an existing public image to avoid 404
        return NextResponse.json({
          title: "Welcome to Electronic Zone",
          subtitle: "Your premier destination for electronics and technology",
          image: "/slider image 1.webp"
        });
      }

      case 'health':
        return NextResponse.json({ 
          status: 'ok', 
          timestamp: new Date().toISOString() 
        });

      case 'stats': {
        // Compute dynamic stats
        const [totalOrders, pendingOrders, deliveredOrders, cancelledOrders, totalProducts, revenueAgg] = await Promise.all([
          prisma.customer_order.count(),
          prisma.customer_order.count({ where: { status: 'pending' } }),
          prisma.customer_order.count({ where: { status: 'delivered' } }),
          prisma.customer_order.count({ where: { status: 'cancelled' } }),
          prisma.product.count(),
          prisma.customer_order.aggregate({ _sum: { total: true } })
        ]);
        const totalRevenue = revenueAgg._sum.total || 0;
        // Profit placeholder (e.g., 20% of revenue) until costs are tracked
        const profit = Math.round(totalRevenue * 0.2);
        return NextResponse.json({
          totalOrders,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          totalRevenue,
          profit,
          visitorsToday: 0,
          totalProducts
        });
      }

      default:
        return NextResponse.json({ 
          error: 'Endpoint not found', 
          endpoint 
        }, { status: 404 });
    }
  } catch (error) {
    console.error('Consolidated API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
