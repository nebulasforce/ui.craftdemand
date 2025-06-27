/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
});
