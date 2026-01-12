/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  images: {

    domains: ['couponscodepro.com'], 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'morecouponcode.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
