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
  // GitHub Pages configuration
  basePath: '/react-map',
  assetPrefix: '/react-map/',
  trailingSlash: true,
  output: 'export',
}

export default nextConfig
