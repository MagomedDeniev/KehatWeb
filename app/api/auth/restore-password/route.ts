import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  token: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      url: coreRoutes.auth.passwordRestore,
      pickBody: (body) => ({
        token: body.token,
        password: body.password,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
