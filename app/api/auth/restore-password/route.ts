import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.API_URL}/restore/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: body.token,
        password: body.password,
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
