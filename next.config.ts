import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blinkers-bucket.nyc3.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
