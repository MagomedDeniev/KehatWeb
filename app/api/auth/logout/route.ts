import { cookies } from "next/headers"
import { apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"
import {
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
} from "@/lib/core/session"

export async function POST() {
  try {
    const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE_NAME)?.value

    if (refreshToken) {
      await fetch(coreRoutes.auth.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
        cache: "no-store",
      })
    }

    await clearAuthCookies()

    return apiResponse(null, 204)
  } catch {
    return apiError()
  }
}
