/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: true,
    optimizePackageImports: ["shiki"],
  },
};

export default nextConfig;
