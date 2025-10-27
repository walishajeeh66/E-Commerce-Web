import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  try {
    switch (endpoint) {
      case 'hero':
        return NextResponse.json({
          title: "Welcome to Electronic Zone",
          subtitle: "Your premier destination for electronics and technology",
          image: "/hero-banner.jpg"
        });

      case 'health':
        return NextResponse.json({ 
          status: 'ok', 
          timestamp: new Date().toISOString() 
        });

      case 'stats':
        return NextResponse.json({
          totalOrders: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          profit: 0,
          visitorsToday: 0,
          totalProducts: 0
        });

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
