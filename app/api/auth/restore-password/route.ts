import { apiRequest, apiResponse, apiError } from "@/lib/server/api"

type RequestBody = {
  token: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      path: "/restore/password",
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
