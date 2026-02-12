import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Next.js 16 experimental options
  turbopack: {
    root: ".",
  },
  // If "proxy" is the new middleware, we might need configuration here
};

export default nextConfig;
