import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev'
  ],
  /* config options here */
};

export default nextConfig;
