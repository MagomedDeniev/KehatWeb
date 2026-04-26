import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { coreRoutes } from "@/lib/routes/core-routes"

type RequestBody = {
  currentPassword: string
  newPassword: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "PATCH",
      url: coreRoutes.account.password,
      auth: true,
      pickBody: (body) => ({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
