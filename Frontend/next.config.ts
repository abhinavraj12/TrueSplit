import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    root: path.join(__dirname),
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      // Google user profile images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Facebook profile pictures
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        pathname: '/**',
      },
      // Facebook platform images
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
      // Apple ID images
      {
        protocol: 'https',
        hostname: 'appleid.apple.com',
        port: '',
        pathname: '/**',
      },
      // AWS S3 (for custom uploads)
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Pravatar for testing
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      // Unsplash (common for placeholders)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
  },

  // Rewrites to proxy API requests to the backend (avoids CORS in development)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: 'http://localhost:8080/api/v1/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;