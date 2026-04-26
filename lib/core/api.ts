import "server-only"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ensureAccessToken } from "@/lib/core/auth-session"
import {
  CURRENT_REFRESH_TOKEN_HEADER,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/core/session"

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type ApiRequestOptions<T> = {
  req: Request
  method: Method
  url: string
  auth?: boolean
  includeClientMeta?: boolean
  extraHeaders?: HeadersInit
  pickBody?: (body: T) => unknown
}

export async function apiRequest<T>({
  req,
  method,
  url,
  auth = false,
  includeClientMeta = false,
  extraHeaders,
  pickBody,
}: ApiRequestOptions<T>) {
  const headers = new Headers(extraHeaders)

  if (auth) {
    const token = await ensureAccessToken({
      allowCookieMutation: true,
    })

    if (!token) {
      return {
        status: 401,
        body: {
          success: false,
          error: {
            code: "unauthorized",
            message: "Требуется авторизация.",
          },
        },
      }
    }

    headers.set("Authorization", `Bearer ${token}`)

    const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE_NAME)?.value

    if (refreshToken) {
      headers.set(CURRENT_REFRESH_TOKEN_HEADER, refreshToken)
    }
  }

  if (includeClientMeta) {
    const browserUserAgent = req.headers.get("user-agent")
    const forwardedFor = req.headers.get("x-forwarded-for")

    if (browserUserAgent) {
      headers.set("X-Client-User-Agent", browserUserAgent)
    }

    if (forwardedFor) {
      headers.set("X-Forwarded-For", forwardedFor)
    }
  }

  const requestBody = pickBody ? pickBody((await req.json()) as T) : undefined

  if (requestBody !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
    cache: "no-store",
  })

  const responseBody = await parseResponseBody(res)

  return {
    status: res.status,
    body: responseBody,
  }
}

async function parseResponseBody(res: Response) {
  if (res.status === 204) {
    return null
  }

  const contentType = res.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    const text = await res.text()
    return text ? { message: text } : null
  }

  try {
    return await res.json()
  } catch {
    return null
  }
}

export function apiResponse(body: unknown, status: number) {
  if (status === 204 || body === null) {
    return new NextResponse(null, { status })
  }

  return NextResponse.json(body, { status })
}

export function apiError() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "server_error",
        message: "Ошибка сервера.",
      },
    },
    { status: 500 }
  )
}
