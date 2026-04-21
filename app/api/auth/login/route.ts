import { setAccessTokenCookie } from "@/lib/core/session"
import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreUrl, corePaths } from "@/lib/core/routes"

type RequestBody = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreUrl(corePaths.auth.login),
      pickBody: (body) => ({
        email: body.email,
        password: body.password,
      }),
    })

    if (result.status < 200 || result.status >= 300) {
      return apiResponse(result.body, result.status)
    }

    const token = result.body.token

    if (!token) {
      return apiError()
    }

    await setAccessTokenCookie(token)

    return apiResponse({ ok: true }, result.status)
  } catch {
    return apiError()
  }
}
