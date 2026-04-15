import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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

    const res = await fetch(`${process.env.API_URL}/me/password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      return NextResponse.json(data, { status: res.status })
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
