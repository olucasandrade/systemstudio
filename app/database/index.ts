import "server-only";

import { PrismaClient } from "../../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };


export const database =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

// Export prisma as an alias for backward compatibility
export const prisma = database;

export * from "../../generated/client";
