// Vercel serverless function for products API
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
    } else if (req.method === 'POST') {
      const productData = req.body;
      
      const product = await prisma.product.create({
        data: productData,
        include: {
          category: true,
          merchant: true
        }
      });
      
      res.json(product);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Products API Error:', error);
    // Return empty array instead of error to prevent frontend crashes
    res.json([]);
  } finally {
    await prisma.$disconnect();
  }
};
