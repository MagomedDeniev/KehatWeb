import { cookies } from "next/headers"

export type CurrentUser = {
  data: {
    email: string
    username: string
    gender: string
    birthDate: string
    roles: string[]
    registeredAt: string
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("access_token")?.value

  if (!token) {
    return null
  }

  const res = await fetch(`${process.env.API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export type UserProfile = {
  data: {
    email: string
    username: string
    gender: string
    birthDate: string
    roles: string[]
    registeredAt: string
  }
}

export async function getUserProfile(
  username: string
): Promise<UserProfile | null> {
  const res = await fetch(
    `${process.env.API_URL}/users/profile/${encodeURIComponent(username)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to load profile for "${username}"`)
  }

  return res.json()
}
