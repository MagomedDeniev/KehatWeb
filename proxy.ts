import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { coreRoutes } from "@/lib/routes/core-routes"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  applyAuthCookies,
  clearAuthCookiesFromResponse,
  isAccessTokenStale,
  type IssuedTokens,
} from "@/lib/core/session"

type RefreshResponse = {
  success: true
  data: IssuedTokens
}

const AUTH_PAGES = new Set(["/auth/login"])

function isProtectedRoute(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    /^\/user\/[^/]+\/settings$/.test(pathname) ||
    /^\/user\/[^/]+\/password$/.test(pathname)
  )
}

async function refreshTokens(refreshToken: string) {
  const response = await fetch(coreRoutes.auth.refresh, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
    cache: "no-store",
  })

  const contentType = response.headers.get("content-type") ?? ""
  const body = contentType.includes("application/json")
    ? ((await response.json()) as RefreshResponse)
    : null

  if (!response.ok || !body?.success || !body.data) {
    return null
  }

  return body.data
}

export async function proxy(req: NextRequest) {
  const isPrefetch =
    req.headers.get("purpose") === "prefetch" ||
    req.headers.has("next-router-prefetch")

  if (isPrefetch) {
    return NextResponse.next()
  }

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value
  const { pathname } = req.nextUrl

  const hasFreshAccessToken =
    !!accessToken && !isAccessTokenStale(accessToken, 60)
  let sessionTokens: IssuedTokens | null = null

  if (!hasFreshAccessToken && refreshToken) {
    sessionTokens = await refreshTokens(refreshToken)

    if (sessionTokens) {
      req.cookies.set(ACCESS_TOKEN_COOKIE_NAME, sessionTokens.accessToken)
      req.cookies.set(REFRESH_TOKEN_COOKIE_NAME, sessionTokens.refreshToken)
    } else {
      req.cookies.delete(ACCESS_TOKEN_COOKIE_NAME)
      req.cookies.delete(REFRESH_TOKEN_COOKIE_NAME)
    }
  }

  const hasSession =
    sessionTokens !== null ||
    (!!accessToken && !isAccessTokenStale(accessToken, 60))

  if (isProtectedRoute(pathname) && !hasSession) {
    const response = NextResponse.redirect(new URL("/auth/login", req.url))
    clearAuthCookiesFromResponse(response.cookies)
    return response
  }

  if (AUTH_PAGES.has(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const response = NextResponse.next()

  if (sessionTokens) {
    applyAuthCookies(response.cookies, sessionTokens)
  } else if (!hasSession && (accessToken || refreshToken)) {
    clearAuthCookiesFromResponse(response.cookies)
  }

  return response
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
}

export const runtime = "nodejs"
