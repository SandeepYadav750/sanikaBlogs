import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.pexels.com",
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "res.cloudinary.com",
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "www.gravatar.com",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;