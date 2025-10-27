// Consolidated API endpoint to reduce Vercel function count
// Handles: /api/hero, /api/health, /api/stats

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the request
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Extract the endpoint after /api/consolidated or from query parameter
  let endpoint = pathname.replace('/api/consolidated', '') || '/';
  if (endpoint === '/' && url.searchParams.get('endpoint')) {
    endpoint = '/' + url.searchParams.get('endpoint');
  }

  try {
    switch (endpoint) {
      case '/hero':
        if (req.method === 'GET') {
          res.json({
            title: "Welcome to Electronic Zone",
            subtitle: "Your premier destination for electronics and technology",
            image: "/hero-banner.jpg"
          });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/health':
        if (req.method === 'GET') {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/stats':
        if (req.method === 'GET') {
          // Return basic stats for admin dashboard
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
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/merchants':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const merchants = await prisma.merchant.findMany({
              orderBy: { createdAt: 'desc' }
            });
            res.json(merchants);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const { name, description, email, phone, address, status } = req.body;
            
            const merchant = await prisma.merchant.create({
              data: {
                name,
                description,
                email,
                phone,
                address,
                status: status || 'active'
              }
            });
            
            res.json(merchant);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/users':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const users = await prisma.user.findMany({
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
              },
              orderBy: { createdAt: 'desc' }
            });
            res.json(users);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const { email, password, role } = req.body;
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 12);
            
            const user = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                role: role || 'user'
              },
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
              }
            });
            
            res.json(user);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      default:
        res.status(404).json({ error: 'Endpoint not found', pathname, endpoint });
    }
  } catch (error) {
    console.error('Consolidated API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
