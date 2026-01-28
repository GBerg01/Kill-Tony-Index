/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@killtony/shared", "@killtony/db"],
};

module.exports = nextConfig;
