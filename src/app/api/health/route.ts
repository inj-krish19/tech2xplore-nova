import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return apiSuccess({ status: "ok", db: "connected", time: new Date().toISOString() });
  } catch (err) {
    console.error("[HEALTH_CHECK_FAILED]", err);
    return apiError("Database unreachable", 503);
  }
}