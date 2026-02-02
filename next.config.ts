import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/No-Kings-Countdown',
  assetPrefix: '/No-Kings-Countdown/',
  async redirects() {
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }

    return [
      {
        source: '/',
        destination: '/No-Kings-Countdown',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
