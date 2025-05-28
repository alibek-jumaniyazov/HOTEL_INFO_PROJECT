import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // Get token from cookie (set by our API client)
    const token = request.cookies.get("admin-token")?.value;

    // Handle /admin root path
    if (pathname === "/admin") {
      if (token && token !== "undefined" && token !== "null") {
        // If authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        // If not authenticated, redirect to login
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    // Login page should be accessible without token
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (token && token !== "undefined" && token !== "null") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!token || token === "undefined" || token === "null") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
