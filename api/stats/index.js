const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get basic stats from database
      const [
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        totalProducts
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'pending' } }),
        prisma.order.count({ where: { status: 'delivered' } }),
        prisma.order.count({ where: { status: 'cancelled' } }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: 'delivered' }
        }),
        prisma.product.count()
      ]);

      const stats = {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        deliveredOrders: deliveredOrders || 0,
        cancelledOrders: cancelledOrders || 0,
        totalRevenue: totalRevenue._sum.total || 0,
        profit: (totalRevenue._sum.total || 0) * 0.3, // 30% profit margin
        visitorsToday: Math.floor(Math.random() * 100) + 50, // Mock data
        totalProducts: totalProducts || 0
      };

      res.json(stats);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Stats API Error:', error);
    res.json({
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      profit: 0,
      visitorsToday: 0,
      totalProducts: 0
    });
  } finally {
    await prisma.$disconnect();
  }
};
