import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const { pathname } = req.nextUrl

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    /^\/user\/[^/]+\/settings$/.test(pathname) ||
    /^\/user\/[^/]+\/password$/.test(pathname)

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/user/:username/settings",
    "/user/:username/password",
    "/auth/login",
  ],
}
