import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow Google Maps embed iframe
  // (iframe { src: ["https://www.google.com/maps/embed", "https://www.google.com/maps"] })
};

export default nextConfig;
