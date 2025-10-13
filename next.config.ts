/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    // Skip linting during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type-checking errors during build
    ignoreBuildErrors: true,
  },
  reactStrictMode: true, // recommended for React
};

module.exports = nextConfig;
