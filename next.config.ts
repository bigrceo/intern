import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for the Docker image (deploy/); Vercel builds its own output.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
