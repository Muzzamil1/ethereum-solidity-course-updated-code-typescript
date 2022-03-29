/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We are adding because vercel is trying to find  typescript types for ethereum folder as well 
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
