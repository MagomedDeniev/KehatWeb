import "server-only"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type ApiRequestOptions<T> = {
  req: Request
  method: Method
  url: string
  auth?: boolean
  pickBody?: (body: T) => unknown
}

export async function apiRequest<T>({
  req,
  method,
  url,
  auth = false,
  pickBody,
}: ApiRequestOptions<T>) {
  const headers: HeadersInit = {}

  if (auth) {
    const token = (await cookies()).get("access_token")?.value

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

    headers["Authorization"] = `Bearer ${token}`
  }

  const requestBody = pickBody ? pickBody((await req.json()) as T) : undefined

  if (requestBody !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
  })

  const responseBody = await res.json()

  return {
    status: res.status,
    body: responseBody,
  }
}

export function apiResponse(body: unknown, status: number) {
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
