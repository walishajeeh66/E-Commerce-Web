// Vercel serverless function for individual image API
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
      const { id } = req.query;
      
      if (!id) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }
      
      const image = await prisma.image.findUnique({
        where: { id }
      });
      
      if (!image) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }
      
      res.json(image);
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;
      
      if (!id) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }
      
      const image = await prisma.image.update({
        where: { id },
        data: updateData
      });
      
      res.json(image);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }
      
      await prisma.image.delete({
        where: { id }
      });
      
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Image API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
