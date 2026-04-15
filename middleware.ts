import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const { pathname } = req.nextUrl

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/profile")

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
}
