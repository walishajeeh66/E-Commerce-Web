// Simple test endpoint for Vercel serverless functions
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    res.status(200).json({
      message: 'Vercel serverless function is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      method: req.method,
      url: req.url
    });
  } catch (error) {
    console.error('Test API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
