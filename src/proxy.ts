import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/post/new", "/settings"];
const ADMIN_ONLY_PREFIXES = ["/admin"];

// Renamed from middleware.ts / `export default` -> proxy.ts / `export const proxy`
// per Next.js 16's rename (network-boundary file, not app-level middleware).
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnly) {
    // Still just an ADMIN_EMAILS allowlist check at the page level
    // (see app/admin/page.tsx) — no role column on blogger yet.
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/post/new", "/settings/:path*"],
};