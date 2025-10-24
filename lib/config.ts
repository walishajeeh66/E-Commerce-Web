const config = {
  // For Vercel deployment, use relative paths for API calls
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'),
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

