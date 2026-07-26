import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError, ForbiddenError } from "@/lib/auth-guard";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

/**
 * Wraps a route handler so unexpected throws become clean, correctly
 * coded responses instead of raw stack traces or a blanket 500.
 * Generic over the second arg so dynamic routes can pass through
 * Next.js 16's async `{ params }` context untouched.
 */
export function withErrorHandling<Ctx = unknown>(
  handler: (req: Request, ctx: Ctx) => Promise<NextResponse>
) {
  return async (req: Request, ctx: Ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        return apiError("Validation failed", 422, err.flatten().fieldErrors);
      }
      if (err instanceof UnauthorizedError) {
        return apiError(err.message, 401);
      }
      if (err instanceof ForbiddenError) {
        return apiError(err.message, 403);
      }
      console.error("[API_ERROR]", err);
      return apiError("Internal server error", 500);
    }
  };
}