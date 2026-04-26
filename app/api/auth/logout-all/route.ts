import { clearAuthCookies } from "@/lib/core/session"
import { apiError, apiRequest, apiResponse } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

export async function POST(req: Request) {
  try {
    const result = await apiRequest({
      req,
      method: "POST",
      url: coreRoutes.auth.logoutAll,
      auth: true,
    })

    if (result.status < 200 || result.status >= 300) {
      if (result.status === 401) {
        await clearAuthCookies()
      }

      return apiResponse(result.body, result.status)
    }

    await clearAuthCookies()

    return apiResponse(null, 204)
  } catch {
    return apiError()
  }
}
