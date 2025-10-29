const config = {
  // Use relative paths to hit Next.js API routes by default in all envs.
  // If you explicitly want to target another origin (e.g., Express server), set NEXT_PUBLIC_API_BASE_URL.
  apiBaseUrl: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL !== undefined
    ? process.env.NEXT_PUBLIC_API_BASE_URL as string
    : '',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

