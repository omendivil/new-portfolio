import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-8845c4797eee47adbbeb7077d3509851.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
