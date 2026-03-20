import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("app_session")?.value);

  if (pathname.startsWith(DASHBOARD_PREFIX) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
