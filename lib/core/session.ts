import "server-only"

import { cookies } from "next/headers"

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
}

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies()

  cookieStore.set("access_token", token, accessTokenCookieOptions)
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies()

  cookieStore.delete("access_token")
}
