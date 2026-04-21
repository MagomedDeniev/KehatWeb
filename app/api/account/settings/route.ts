import { apiRequest, apiResponse, apiError } from "@/lib/core/api"
import { setAccessTokenCookie } from "@/lib/core/session"
import { coreUrl, corePaths } from "@/lib/core/routes"

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
      url: coreUrl(corePaths.account.settings),
      auth: true,
      pickBody: (body) => ({
        email: body.email,
        username: body.username,
        gender: body.gender,
        birthDate: body.birthDate,
      }),
    })

    const token = result.body?.data?.token

    if (token) {
      await setAccessTokenCookie(token)
    }

    // Удаляем токен из ответа, чтобы токен не попал в клиент
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
