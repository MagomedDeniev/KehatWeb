import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { setAccessTokenCookie } from "@/lib/auth/session"

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "unauthorized",
            message: "Требуется авторизация.",
          },
        },
        { status: 401 }
      )
    }

    const body = await req.json()

    const res = await fetch(`${process.env.API_URL}/me/settings`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      return NextResponse.json(data, { status: res.status })
    }

    const nextToken = data.data?.token

    if (nextToken) {
      await setAccessTokenCookie(nextToken)
    }

    return NextResponse.json(
      {
        success: true,
        data: data.data,
        message: data.message,
      },
      { status: res.status }
    )
  } catch {
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
}
