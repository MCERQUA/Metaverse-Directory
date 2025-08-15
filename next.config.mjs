/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  // SWC minification for better performance
  swcMinify: true,
}

export default nextConfig
