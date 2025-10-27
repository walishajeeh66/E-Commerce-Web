// Vercel serverless function for user by email API
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
      const { email } = req.query;
      
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }
      
      const user = await prisma.user.findFirst({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('User by email API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
