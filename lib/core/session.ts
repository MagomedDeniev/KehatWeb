import "server-only"

import { cookies } from "next/headers"

export const ACCESS_TOKEN_COOKIE_NAME = "access_token"
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token"
export const CURRENT_REFRESH_TOKEN_HEADER = "X-Current-Refresh-Token"

export type IssuedTokens = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
  refreshTokenExpiresAt: string
}

type AuthCookieOptions = {
  httpOnly: boolean
  secure: boolean
  sameSite: "lax"
  path: string
  maxAge?: number
  expires?: Date
}

type CookieWriter = {
  set: (name: string, value: string, options: AuthCookieOptions) => void
  delete: (name: string) => void
}

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

function parseJwtPayload(token: string) {
  const [, payload] = token.split(".")

  if (!payload) {
    return null
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    )

    return JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf8")) as {
      exp?: number
    }
  } catch {
    return null
  }
}

export function getAccessTokenExpiresAt(token: string) {
  const payload = parseJwtPayload(token)

  if (!payload?.exp) {
    return null
  }

  return payload.exp
}

export function isAccessTokenStale(token: string, bufferSeconds = 30) {
  const exp = getAccessTokenExpiresAt(token)

  if (!exp) {
    return true
  }

  return exp <= Math.floor(Date.now() / 1000) + bufferSeconds
}

function getAccessTokenCookieOptions(
  accessTokenExpiresIn: number
): AuthCookieOptions {
  return {
    ...authCookieOptions,
    maxAge: Math.max(accessTokenExpiresIn, 0),
  }
}

function getRefreshTokenCookieOptions(
  refreshTokenExpiresAt: string
): AuthCookieOptions {
  const expiresAt = new Date(refreshTokenExpiresAt)

  return {
    ...authCookieOptions,
    expires: Number.isNaN(expiresAt.getTime()) ? undefined : expiresAt,
  }
}

function setAuthCookiesOnStore(
  cookieStore: Pick<CookieWriter, "set">,
  tokens: IssuedTokens
) {
  cookieStore.set(
    ACCESS_TOKEN_COOKIE_NAME,
    tokens.accessToken,
    getAccessTokenCookieOptions(tokens.accessTokenExpiresIn)
  )
  cookieStore.set(
    REFRESH_TOKEN_COOKIE_NAME,
    tokens.refreshToken,
    getRefreshTokenCookieOptions(tokens.refreshTokenExpiresAt)
  )
}

function clearAuthCookiesOnStore(cookieStore: Pick<CookieWriter, "delete">) {
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME)
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
}

export async function setAuthCookies(tokens: IssuedTokens) {
  const cookieStore = await cookies()

  setAuthCookiesOnStore(cookieStore, tokens)
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  clearAuthCookiesOnStore(cookieStore)
}

export function applyAuthCookies(
  cookieStore: Pick<CookieWriter, "set">,
  tokens: IssuedTokens
) {
  setAuthCookiesOnStore(cookieStore, tokens)
}

export function clearAuthCookiesFromResponse(
  cookieStore: Pick<CookieWriter, "delete">
) {
  clearAuthCookiesOnStore(cookieStore)
}
