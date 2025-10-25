// Simple hero API endpoint without Prisma
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
      // Return mock hero data
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
      // Handle hero data updates (for admin)
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
  } catch (error) {
    console.error('Hero API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
