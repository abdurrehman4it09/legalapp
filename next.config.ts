import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // cacheComponents + partialPrefetching are companion top-level options in Next.js 16
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
