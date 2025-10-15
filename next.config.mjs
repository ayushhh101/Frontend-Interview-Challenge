/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add these options for better CSS handling
  poweredByHeader: false,
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
