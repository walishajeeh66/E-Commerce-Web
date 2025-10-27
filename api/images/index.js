// Vercel serverless function for images API
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
    } else if (req.method === 'POST') {
      const { productID, image } = req.body;
      
      const imageRecord = await prisma.image.create({
        data: {
          productID,
          image
        }
      });
      
      res.json(imageRecord);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Images API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
