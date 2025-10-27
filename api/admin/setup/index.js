// Vercel serverless function for admin setup API
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
      // Return current users and their roles
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        message: "Admin Setup API",
        instructions: "Use POST method to create admin user",
        example: {
          method: "POST",
          body: {
            email: "admin@example.com",
            password: "admin123456"
          }
        },
        currentUsers: users
      });
    } else if (req.method === 'POST') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: { email }
      });

      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'admin'
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.json({
        message: 'Admin user created successfully',
        user
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Admin Setup API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
