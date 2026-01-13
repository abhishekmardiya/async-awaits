import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**", // allow all path starting with /
      },
    ],
    remotePatterns: [
      // We cannot whitelist specific domains since we do not know in advance which image sources will appear on the job post page.
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
    // qualities --> for nextjs 16
    qualities: [10, 30, 50, 100],
    deviceSizes: [370, 768, 1280, 1920],
    // Next.js cannot safely cache assets in the public folder because they may change.
    // https://nextjs.org/docs/app/api-reference/file-conventions/public-folder#caching
    // Set minimumCacheTTL for optimized images. (1 year cache)
    minimumCacheTTL: 31536000,
  },
  // to avoid errors when using pino with nextjs
  serverExternalPackages: ["pino", "pino-pretty"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
