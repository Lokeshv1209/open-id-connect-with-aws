import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// MUST be named export 'middleware' for Next.js 15
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token");

  // Protected paths
  const isProtectedPath = path.startsWith("/dashboard") || path.startsWith("/org");

  // Public paths
  const isPublicPath = path === "/login" || path === "/signup" || path === "/forgot-password";

  // Root redirect
  if (path === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect routes
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in, redirect from login
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
