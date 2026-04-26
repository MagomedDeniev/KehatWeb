import "server-only"

import { cookies } from "next/headers"
import { coreRoutes } from "@/lib/routes/core-routes"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  isAccessTokenStale,
  setAuthCookies,
  type IssuedTokens,
} from "@/lib/core/session"

type RefreshSuccessResponse = {
  success: true
  data: IssuedTokens
  message?: string
}

function isIssuedTokens(value: unknown): value is IssuedTokens {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<IssuedTokens>

  return (
    typeof candidate.accessToken === "string" &&
    typeof candidate.accessTokenExpiresIn === "number" &&
    typeof candidate.refreshToken === "string" &&
    typeof candidate.refreshTokenExpiresAt === "string"
  )
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    return null
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function refreshSession(refreshToken: string) {
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

  const body = (await parseJsonResponse(response)) as RefreshSuccessResponse | null

  if (!response.ok || !body?.success || !isIssuedTokens(body.data)) {
    return null
  }

  return body.data
}

type EnsureAccessTokenOptions = {
  allowCookieMutation?: boolean
}

export async function ensureAccessToken({
  allowCookieMutation = false,
}: EnsureAccessTokenOptions = {}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value

  if (accessToken && !isAccessTokenStale(accessToken, 60)) {
    return accessToken
  }

  if (!allowCookieMutation) {
    return null
  }

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  if (!refreshToken) {
    await clearAuthCookies()
    return null
  }

  const refreshedTokens = await refreshSession(refreshToken)

  if (!refreshedTokens) {
    await clearAuthCookies()
    return null
  }

  await setAuthCookies(refreshedTokens)

  return refreshedTokens.accessToken
}
