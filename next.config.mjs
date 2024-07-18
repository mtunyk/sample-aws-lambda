// @ts-check
import * as child_process from 'child_process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  generateBuildId: async () => (
    child_process.execSync('git rev-parse --short HEAD')
      .toString()
      .trim()
  ),
  // transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      },
    ],
    domains: ['pbs.twimg.com'],
  },
}

export default nextConfig
