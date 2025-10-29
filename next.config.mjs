/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: ""
          },
        ],
      },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
    async rewrites() {
      return [
        { source: '/hero-banner.jpg', destination: '/slider image 1.webp' },
        { source: '/icons/default.png', destination: '/randomuser.jpg' },
      ];
    },
};

export default nextConfig;
