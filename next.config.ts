import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
      },
    ],
  },
  // to avoid errors when using pino with nextjs
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default nextConfig;
