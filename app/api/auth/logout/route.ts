import { clearAccessTokenCookie } from "@/lib/server/session"
import { apiResponse, apiError } from "@/lib/server/api"

export async function POST() {
  try {
    await clearAccessTokenCookie()
    return apiResponse({ ok: true }, 200)
  } catch {
    return apiError()
  }
}
