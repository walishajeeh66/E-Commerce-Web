// Vercel serverless function for orders API
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const userId = searchParams.get('userId');
      const status = searchParams.get('status');
      
      const where = {};
      if (userId) {
        where.userId = userId;
      }
      if (status) {
        where.status = status;
      }
      
      const orders = await prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(orders);
    } else if (req.method === 'POST') {
      const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
      
      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: 'pending',
          shippingAddress,
          paymentMethod
        }
      });
      
      // Create order items
      const orderItems = await Promise.all(
        items.map((item: any) =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }
          })
        )
      );
      
      // Update order with items
      const orderWithItems = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });
      
      res.json(orderWithItems);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
