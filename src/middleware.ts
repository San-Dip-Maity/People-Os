import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "peopleos_session";

// Public route prefixes
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip static assets, internal Next.js requests, favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isLandingPage = pathname === "/";

  // 2. If authenticated user attempts to visit login/signup, redirect to /dashboard
  if (sessionCookie && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. Allow landing page and auth pages for unauthenticated visitors
  if (isLandingPage || isAuthPage) {
    return NextResponse.next();
  }

  // 4. Protect all other portal routes
  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/dashboard") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
