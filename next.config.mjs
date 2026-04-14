/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    outputFileTracingIncludes: {
      '/api/**/*': ['./bot/**/*']
    }
  },
  serverExternalPackages: ['discord.js', '@discordjs/ws', 'zlib-sync', 'bufferutil', 'utf-8-validate', '@google/generative-ai'],
  transpilePackages: ['bot'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
        port: '',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        port: '',
        pathname: '/store_item_assets/**',
      }
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
