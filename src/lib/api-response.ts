import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

/** Wraps a route handler so unexpected throws become clean 500s, not raw stack traces. */
export function withErrorHandling(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      if (err instanceof ZodError) {
        return apiError("Validation failed", 422, err.flatten().fieldErrors);
      }
      console.error("[API_ERROR]", err);
      return apiError("Internal server error", 500);
    }
  };
}