import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * This generator (the new "prisma-client" provider) requires an explicit
 * driver adapter — it no longer manages the Postgres connection itself
 * the way the classic prisma-client-js generator did. `PrismaPg` wraps
 * `pg` under the hood and is what the `adapter` option below expects.
 *
 * npm install @prisma/adapter-pg pg
 * npm install -D @types/pg
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Prevent multiple PrismaClient instances in dev (hot reload) and
// keep connections bounded in serverless (Vercel) environments.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}