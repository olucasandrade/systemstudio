import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    experimental: {
        authInterrupts: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    },
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
          ],
    },
  }
   
module.exports = nextConfig