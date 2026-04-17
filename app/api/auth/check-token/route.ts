import { apiRequest, apiResponse, apiError } from "@/lib/server/api"

type RequestBody = {
  token: string
  type: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      path: "/auth/check/token",
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
