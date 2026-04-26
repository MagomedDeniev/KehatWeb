import { cookies } from "next/headers"
import { apiError, apiResponse } from "@/lib/core/api"
import { refreshSession } from "@/lib/core/auth-session"
import {
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/core/session"

export async function POST() {
  try {
    const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE_NAME)?.value

    if (!refreshToken) {
      await clearAuthCookies()
      return apiResponse(
        {
          success: false,
          error: {
            code: "unauthorized",
            message: "Требуется авторизация.",
          },
        },
        401
      )
    }

    const tokens = await refreshSession(refreshToken)

    if (!tokens) {
      await clearAuthCookies()
      return apiResponse(
        {
          success: false,
          error: {
            code: "unauthorized",
            message: "Сессия истекла. Войдите снова.",
          },
        },
        401
      )
    }

    await setAuthCookies(tokens)

    return apiResponse(
      {
        success: true,
        message: "Tokens refreshed successfully.",
      },
      200
    )
  } catch {
    return apiError()
  }
}
