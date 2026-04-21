import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreUrl, corePaths } from "@/lib/core/routes"

type RequestBody = {
  email: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreUrl(corePaths.auth.passwordForgot),
      pickBody: (body) => ({
        email: body.email,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
