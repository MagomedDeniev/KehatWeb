import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { setAuthCookies } from "@/lib/core/session"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreRoutes.auth.register,
      includeClientMeta: true,
      pickBody: (body) => ({
        username: body.username,
        gender: body.gender,
        birthDate: body.birthDate,
        email: body.email,
        password: body.password,
      }),
    })

    if (result.status < 200 || result.status >= 300) {
      return apiResponse(result.body, result.status)
    }

    const tokens = result.body?.data

    if (
      tokens?.accessToken &&
      typeof tokens.accessTokenExpiresIn === "number" &&
      tokens.refreshToken &&
      tokens.refreshTokenExpiresAt
    ) {
      await setAuthCookies(tokens)
    }

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
