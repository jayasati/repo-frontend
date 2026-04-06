import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * Proxy all /backend/* requests → NestJS API on localhost:3000
   * This avoids CORS issues in the browser and lets us use relative paths
   * in client-side fetch calls via the /backend/* prefix.
   *
   * In production, replace NEXT_PUBLIC_API_URL with your deployed API domain.
   */
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/:path*`,
      },
    ]
  },
  /**
   * Images — allow GitHub avatar domain for future OAuth profile pictures.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
