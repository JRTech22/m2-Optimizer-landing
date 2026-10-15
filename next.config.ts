import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/DMA', destination: '/dma' },
      { source: '/M2Optimizer.appinstaller', destination: '/api/appinstaller' },
    ]
  },
}

export default nextConfig
