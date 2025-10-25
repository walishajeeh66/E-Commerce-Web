// Consolidated API endpoint to reduce Vercel function count
// Handles: /api/hero, /api/auth/session, /api/auth/_log, /api/health

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the request
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Extract the endpoint after /api/consolidated
  const endpoint = pathname.replace('/api/consolidated', '') || '/';

  try {
    switch (endpoint) {
      case '/hero':
        if (req.method === 'GET') {
          res.json({
            title: "Welcome to Electronic Zone",
            subtitle: "Your premier destination for electronics and technology",
            image: "/hero-banner.jpg"
          });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;


      case '/health':
        if (req.method === 'GET') {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/auth/providers':
        if (req.method === 'GET') {
          res.json({
            credentials: {
              id: "credentials",
              name: "Credentials",
              type: "credentials"
            }
          });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;



      default:
        res.status(404).json({ error: 'Endpoint not found', pathname, endpoint });
    }
  } catch (error) {
    console.error('Consolidated API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
