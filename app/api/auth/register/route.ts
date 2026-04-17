import { apiRequest, apiResponse, apiError } from "@/lib/server/api"
import { setAccessTokenCookie } from "@/lib/server/session"

type RequestBody = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const result = await apiRequest<RequestBody>({
      req,
      method: "POST",
      path: "/register",
      pickBody: (body) => ({
        username: body.username,
        gender: body.gender,
        birthDate: body.birthDate,
        email: body.email,
        password: body.password,
      }),
    })

    if (result.status < 200 || result.status >= 300) {
      return apiResponse(result.body, result.status)
    }

    const token = result.body.data?.token

    if (!token) {
      return apiError()
    }

    await setAccessTokenCookie(token)

    const safeData = { ...result.body.data }
    delete safeData.token

    const responseBody = {
      ...result.body,
      data: safeData,
    }

    return apiResponse(responseBody, result.status)
  } catch {
    return apiError()
  }
}
