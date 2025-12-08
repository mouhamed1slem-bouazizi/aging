import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ai-resource.ailabtools.com',
        pathname: '/face-filters/**',
      },
    ],
  },
};

export default nextConfig;
