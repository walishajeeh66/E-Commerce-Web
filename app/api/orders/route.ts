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
    const { name, lastname, phone, email, company, adress, apartment, postalCode, city, country, orderNotice, total, products } = await request.json();
    
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
      products.map((item: any) =>
        prisma.customer_order_product.create({
          data: {
            customerOrderId: order.id,
            productId: item.productId,
            quantity: item.quantity
          }
        })
      )
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
    
    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
