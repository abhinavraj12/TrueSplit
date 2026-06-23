import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the project root to the current directory
    // This prevents Next.js from mis‑detecting a parent workspace root
    root: path.join(__dirname),
  },
};

export default nextConfig;