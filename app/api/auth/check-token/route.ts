import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.API_URL}/auth/check/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: body.token,
        type: body.type,
      }),
    })

    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
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
