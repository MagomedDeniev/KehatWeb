import { NextResponse } from "next/server"
import { setAccessTokenCookie } from "@/lib/auth/session"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.API_URL}/login_check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "Login failed" },
        { status: res.status }
      )
    }

    const token = data.token

    if (!token) {
      return NextResponse.json(
        { message: "Token not found in response" },
        { status: 500 }
      )
    }

    await setAccessTokenCookie(token)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
