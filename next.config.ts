/** @type {import('next').NextConfig} */

const nextConfig = {

  typescript: {
    // Skip type-checking errors during build
    ignoreBuildErrors: true,
  },
  reactStrictMode: true, // recommended for React
};

module.exports = nextConfig;
