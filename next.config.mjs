/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingIncludes: {
    '/api/bot/**/*': ['./bot/**/*']
  },
  serverExternalPackages: [
    'discord.js', 
    '@discordjs/ws', 
    '@discordjs/voice', 
    'zlib-sync', 
    'bufferutil', 
    'utf-8-validate', 
    '@google/generative-ai', 
    '@snazzah/davey',
    'better-sqlite3',
    'ffmpeg-static',
    'libsodium-wrappers',
    '@discord-player/extractor'
  ],
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
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        port: '',
        pathname: '/**',
      }
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
