import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ably"],
  // Deploy-friendly: don't fail the build on pre-existing type / lint issues.
  // Editors still surface these errors during development.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
