// Vercel serverless function for products API
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
      // Return mock products data for now (until database is properly configured)
      const mockProducts = [
        {
          id: '1',
          title: 'Smart Watch Pro',
          slug: 'smart-watch-pro',
          mainImage: 'watch for banner.png',
          price: 299,
          rating: 4,
          description: 'Advanced smartwatch with health monitoring',
          manufacturer: 'TechCorp',
          inStock: 10,
          category: { id: '1', name: 'Electronics' },
          merchant: { id: '1', name: 'TechStore' }
        },
        {
          id: '2',
          title: 'Wireless Headphones',
          slug: 'wireless-headphones',
          mainImage: 'headphones.jpg',
          price: 199,
          rating: 5,
          description: 'High-quality wireless headphones',
          manufacturer: 'AudioTech',
          inStock: 15,
          category: { id: '2', name: 'Gadgets' },
          merchant: { id: '2', name: 'AudioStore' }
        },
        {
          id: '3',
          title: 'Gaming Laptop',
          slug: 'gaming-laptop',
          mainImage: 'laptop.jpg',
          price: 1299,
          rating: 4,
          description: 'High-performance gaming laptop',
          manufacturer: 'GameTech',
          inStock: 5,
          category: { id: '3', name: 'Computers' },
          merchant: { id: '3', name: 'ComputerStore' }
        },
        {
          id: '4',
          title: 'Dash Cam 4K',
          slug: 'dash-cam-4k',
          mainImage: 'dashcam.jpg',
          price: 149,
          rating: 4,
          description: '4K dash camera with night vision',
          manufacturer: 'CarTech',
          inStock: 20,
          category: { id: '4', name: 'Dashcams' },
          merchant: { id: '4', name: 'CarStore' }
        }
      ];
      
      res.json(mockProducts);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ error: error.message });
  }
}