// Consolidated API endpoint to reduce serverless function count
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
    // Parse the endpoint from the URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // Route to different handlers based on path
    if (pathname === '/api/hero' || pathname.endsWith('/hero')) {
      await handleHero(req, res);
    } else if (pathname === '/api/auth/session' || pathname.endsWith('/auth/session')) {
      await handleAuthSession(req, res);
    } else if (pathname === '/api/auth/_log' || pathname.endsWith('/auth/_log')) {
      await handleAuthLog(req, res);
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Consolidated API Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

// Hero endpoint handler
async function handleHero(req, res) {
  if (req.method === 'GET') {
    const heroData = {
      heading: 'THE PRODUCT OF THE FUTURE',
      description: 'Discover cutting-edge tech tailored for you.',
      image: 'watch for banner.png',
      buyNowUrl: '/shop',
      learnMoreUrl: '#',
      product: {
        id: '1',
        title: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        mainImage: 'watch for banner.png',
        price: 299
      }
    };
    res.json(heroData);
  } else if (req.method === 'POST') {
    const { image, heading, description, buyNowUrl, learnMoreUrl, productId } = req.body;
    res.json({ 
      success: true, 
      message: 'Hero data updated successfully',
      data: { image, heading, description, buyNowUrl, learnMoreUrl, productId }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Auth session endpoint handler
async function handleAuthSession(req, res) {
  if (req.method === 'GET') {
    res.json({ user: null, session: null });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Auth log endpoint handler
async function handleAuthLog(req, res) {
  if (req.method === 'POST') {
    const { action, userId, timestamp } = req.body;
    res.json({ 
      success: true, 
      message: 'Auth log recorded successfully',
      data: { action, userId, timestamp }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
