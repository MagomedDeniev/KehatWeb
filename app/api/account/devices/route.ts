import { cookies } from "next/headers"
import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"
import {
  CURRENT_REFRESH_TOKEN_HEADER,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/core/session"

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

    const result = await apiRequest({
      req,
      method: "GET",
      url: coreRoutes.account.devices,
      auth: true,
      extraHeaders: refreshToken
        ? { [CURRENT_REFRESH_TOKEN_HEADER]: refreshToken }
        : undefined,
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
