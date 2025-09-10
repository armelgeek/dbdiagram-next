import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // experimental: {
  //   reactCompiler: true,
  // },

  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'twicpics-assets.twic.pics',
        port: '',
        pathname: '/lugastudio-review-phone/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/creativekitabikin/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
