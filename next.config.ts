import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export a static site for GitHub Pages while preserving the existing Vercel app.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
