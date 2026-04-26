import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  email: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreRoutes.auth.passwordForgot,
      pickBody: (body) => ({
        email: body.email,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
