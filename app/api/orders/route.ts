import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    
    const where: any = {};
    if (email) {
      where.email = email;
    }
    if (status) {
      where.status = status;
    }
    
    const orders = await prisma.customer_order.findMany({
      where,
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { dateTime: 'desc' }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      city,
      country,
      orderNotice,
      total,
      products,
      userId
    } = await request.json();

    const items = Array.isArray(products) ? products : [];
    
    // Create order
    const order = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        city,
        country,
        orderNotice,
        total,
        status: 'pending'
      }
    });
    
    // Create order items
    const orderItems = await Promise.all(
      items.map((item: any) => {
        if (!item || !item.productId || typeof item.quantity !== 'number') {
          throw new Error('Invalid order item format');
        }
        return prisma.customer_order_product.create({
          data: {
            customerOrderId: order.id,
            productId: item.productId,
            quantity: item.quantity
          }
        });
      })
    );
    
    // Get order with items
    const orderWithItems = await prisma.customer_order.findUnique({
      where: { id: order.id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    // Create a notification for the user, if they exist
    try {
      const targetUserId = typeof userId === 'string' && userId.length > 0
        ? userId
        : (await prisma.user.findFirst({ where: { email }, select: { id: true } }))?.id;
      if (targetUserId) {
          await prisma.notification.create({
            data: {
              userId: targetUserId,
              title: 'Order Confirmed',
              message: `Great news! Your order #${order.id} has been confirmed and will be prepared for shipping.`,
              type: 'ORDER_UPDATE',
              priority: 'HIGH',
              metadata: {
                status: 'confirmed',
                orderId: order.id,
                totalAmount: total,
              },
            }
          });
      }
    } catch (e) {
      console.error('Order notification create error:', e);
    }
    
    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
