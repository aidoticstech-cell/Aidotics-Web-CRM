import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    const api = process.env.API_URL || "http://localhost:4100";
    return [{ source: "/api/:path*", destination: `${api}/:path*` }];
  },
};

export default nextConfig;
