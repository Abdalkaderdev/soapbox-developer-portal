import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.soapboxsuperapp.com",
      },
    ],
  },
};

export default nextConfig;
