/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
