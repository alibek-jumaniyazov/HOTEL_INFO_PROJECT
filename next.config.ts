/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sulaymonhotel.uz',
        pathname: '/api/uploads/**',
      },
    ],
    domains: ['api.sulaymonhotel.uz'], // Added for compatibility
  },
};

module.exports = nextConfig;
