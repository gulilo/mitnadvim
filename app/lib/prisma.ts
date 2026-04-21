import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined");
}

const adapter = connectionString.includes("neon.tech")
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({ connectionString });

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
