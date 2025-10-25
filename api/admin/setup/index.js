const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Check if admin already exists
      const existingAdmin = await prisma.user.findFirst({
        where: { email, role: 'admin' }
      });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin user already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'admin'
        }
      });

      res.status(201).json({ 
        message: 'Admin user created successfully',
        email: admin.email,
        role: admin.role
      });

    } else if (req.method === 'GET') {
      // Handle GET request - show admin setup form or info
      res.json({ 
        message: 'Admin Setup API',
        instructions: 'Use POST method to create admin user',
        example: {
          method: 'POST',
          body: {
            email: 'admin@example.com',
            password: 'admin123456'
          }
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  } finally {
    await prisma.$disconnect();
  }
};
