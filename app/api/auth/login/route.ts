import { setAuthCookies } from "@/lib/core/session"
import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreRoutes.auth.login,
      includeClientMeta: true,
      pickBody: (body) => ({
        email: body.email,
        password: body.password,
      }),
    })

    if (result.status < 200 || result.status >= 300) {
      return apiResponse(result.body, result.status)
    }

    const tokens = result.body?.data

    if (
      !tokens?.accessToken ||
      typeof tokens.accessTokenExpiresIn !== "number" ||
      !tokens.refreshToken ||
      !tokens.refreshTokenExpiresAt
    ) {
      return apiError()
    }

    await setAuthCookies(tokens)

    return apiResponse(
      {
        success: true,
        message: result.body?.message ?? "Login successful.",
      },
      result.status
    )
  } catch {
    return apiError()
  }
}
