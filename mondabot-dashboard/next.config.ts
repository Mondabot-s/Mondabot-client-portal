import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In Railway production, services communicate via localhost
    const isRailway = process.env.RAILWAY_ENVIRONMENT;
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev || isRailway) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ];
    }
    return [];
  },
  
  // Railway optimization
  output: 'standalone',
  
  // Handle Railway static assets
  trailingSlash: false,
  
  // Environment configuration
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  },
  
  // Development optimizations
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  
  // Handle source maps in development
  productionBrowserSourceMaps: false,
};

export default nextConfig;
