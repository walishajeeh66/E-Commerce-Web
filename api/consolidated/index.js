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

      case '/products':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            // Parse query parameters
            const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
            const mode = searchParams.get('mode');
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            const category = searchParams.get('category');
            const search = searchParams.get('search');
            
            // Build where clause
            const where = {};
            if (category) {
              where.category = { name: category };
            }
            if (search) {
              where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ];
            }
            
            // Fetch products with relations
            const products = await prisma.product.findMany({
              where,
              include: {
                category: true,
                merchant: true
              },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { id: 'desc' }
            });
            
            res.json(products);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const productData = req.body;
            
            const product = await prisma.product.create({
              data: productData,
              include: {
                category: true,
                merchant: true
              }
            });
            
            res.json(product);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/categories':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const categories = await prisma.category.findMany({
              include: {
                product: true
              }
            });
            res.json(categories);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const { name, description, image } = req.body;
            
            const category = await prisma.category.create({
              data: {
                name,
                description,
                image
              }
            });
            
            res.json(category);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/orders':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
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
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
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
              items.map((item) =>
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
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/images':
        if (req.method === 'GET') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
            const productId = searchParams.get('productId');
            
            if (productId) {
              const images = await prisma.image.findMany({
                where: { productID: productId },
                orderBy: { createdAt: 'desc' }
              });
              res.json(images);
            } else {
              res.status(400).json({ error: 'Product ID is required' });
            }
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          } finally {
            await prisma.$disconnect();
          }
        } else if (req.method === 'POST') {
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          try {
            const { productID, image } = req.body;
            
            const imageRecord = await prisma.image.create({
              data: {
                productID,
                image
              }
            });
            
            res.json(imageRecord);
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
