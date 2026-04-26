import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  email: string
  username: string
  gender: string
  birthDate: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "PATCH",
      url: coreRoutes.account.settings,
      auth: true,
      pickBody: (body) => ({
        email: body.email,
        username: body.username,
        gender: body.gender,
        birthDate: body.birthDate,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
