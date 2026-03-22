import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths that bypass authentication
  const isPublicPath = path === "/login" || path.startsWith("/api/auth") || path.startsWith("/_next") || path === "/favicon.ico" || path.endsWith(".png") || path.endsWith(".jpg");

  // Determine if the user has an auth token
  const token = request.cookies.get("auth-token")?.value;

  // Protect all dashboard routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Prevent logged-in users from seeing the login page
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
