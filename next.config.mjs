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
    turbopack: {},
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
          ],
    },
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/.prisma/client/**/*'],
      '/*': ['./node_modules/.prisma/client/**/*'],
    },
  }
   
export default nextConfig