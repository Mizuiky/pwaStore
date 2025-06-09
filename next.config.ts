import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";
import type { PluginOptions } from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true
};

const pwaConfig: PluginOptions = {
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
};

export default withPWA(pwaConfig)(nextConfig);