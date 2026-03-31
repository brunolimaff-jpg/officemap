import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@google/genai'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.habbo.com',
        port: '',
        pathname: '/**',
      },
      // Sulake CDN usado pelo Habbo Imager
      {
        protocol: 'https',
        hostname: '*.habbo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.sulake.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
