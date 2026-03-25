import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "optcgapi.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "limitlesstcg.nyc3.cdn.digitaloceanspaces.com",
        pathname: "/one-piece/**",
      },
    ],
  },
};

export default nextConfig;
