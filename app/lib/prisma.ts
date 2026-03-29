import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
  connectionString: process.env.POSTGRES_URL,
});

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
