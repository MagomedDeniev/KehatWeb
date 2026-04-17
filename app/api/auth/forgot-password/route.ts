import { apiRequest, apiResponse, apiError } from "@/lib/server/api"

type RequestBody = {
  email: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      path: "/forgot/password",
      pickBody: (body) => ({
        email: body.email,
      }),
    })

    return apiResponse(result.body, result.status)
  } catch {
    return apiError()
  }
}
