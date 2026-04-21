import { clearAccessTokenCookie } from "@/lib/core/session"
import { apiResponse, apiError } from "@/lib/core/api"

export async function POST() {
  try {
    await clearAccessTokenCookie()
    return apiResponse({ ok: true }, 200)
  } catch {
    return apiError()
  }
}
