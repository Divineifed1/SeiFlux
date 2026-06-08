import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3001",
    "http://10.153.66.224:3002",
  ],
};

export default nextConfig;
