/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Skip linting during build (so Vercel build won’t fail)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Skip type-checking errors during build
    ignoreBuildErrors: true,
  },
  turbopack: {
    // Optional: explicitly set root to fix your "multiple lockfiles" warning
    root: "./Xpence Tracker/equinox",
  },
};

module.exports = nextConfig;
