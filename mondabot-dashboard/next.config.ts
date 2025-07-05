import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`
          : 'http://localhost:3001/api/:path*',
      },
    ];
  },
  
  // CRITICAL: Must be 'standalone' for Railway
  output: 'standalone',
  
  // CRITICAL: Add publicRuntimeConfig to prevent "Cannot convert undefined or null to object" error
  publicRuntimeConfig: {},
  
  // Handle Railway static assets
  trailingSlash: false,
  
  // Environment configuration
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  },
  
  // Add webpack config for better error handling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    if (process.env.NODE_ENV === 'development') {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    return config;
  },
  
  // Handle source maps in development
  productionBrowserSourceMaps: false,
  
  // Add better error handling
  async redirects() {
    return [];
  },
  
  // Improve performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
