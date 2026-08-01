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

/**
 * pg-connection-string (used internally by `pg`) treats sslmode=prefer/
 * require/verify-ca as aliases for verify-full and logs a "SECURITY
 * WARNING" deprecation notice on every connection when it sees one of
 * those values in the connection string — that's the console warning
 * this was built to fix.
 *
 * Fix: pull sslmode out of the URL ourselves and pass SSL as an explicit
 * `ssl` option instead of a string param, so pg-connection-string's
 * alias-parsing path (the thing that logs the warning) never runs.
 *
 * Tradeoff, flagging it rather than hiding it: `rejectUnauthorized: false`
 * matches the *current* behavior of sslmode=require/prefer (encrypts the
 * connection, does not verify the server certificate). If you want actual
 * certificate verification, set DATABASE_URL's sslmode to verify-full and
 * this needs a real `ca` cert passed into the ssl object instead — that's
 * a separate, deliberate change, not something to default into silently.
 */
function buildAdapter() {
  const connectionString = process.env.DATABASE_URL ?? "";
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode");
  url.searchParams.delete("sslmode");

  const sslDisabled = sslMode === "disable" || sslMode === null;

  return new PrismaPg({
    connectionString: url.toString(),
    ssl: sslDisabled ? undefined : { rejectUnauthorized: false },
  });
}

const adapter = buildAdapter();

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