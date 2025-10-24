// Vercel serverless function for products API
const { PrismaClient } = require('@prisma/client');

// Create a global prisma instance to avoid multiple connections
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

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
    switch (req.method) {
      case 'GET':
        const products = await prisma.product.findMany({
          include: {
            category: true,
            merchant: true
          }
        });
        res.json(products);
        break;

      case 'POST':
        const newProduct = await prisma.product.create({
          data: req.body,
          include: {
            category: true,
            merchant: true
          }
        });
        res.status(201).json(newProduct);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ error: error.message });
  }
  // Don't disconnect in serverless environment
}
}