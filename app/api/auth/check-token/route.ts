import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  token: string
  type: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreRoutes.auth.tokenCheck,
      pickBody: (body) => ({
        token: body.token,
        type: body.type,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
