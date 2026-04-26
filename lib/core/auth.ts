import { cache } from "react"
import { cookies } from "next/headers"
import { coreRoutes } from "@/lib/routes/core-routes"
import { ensureAccessToken } from "@/lib/core/auth-session"
import {
  CURRENT_REFRESH_TOKEN_HEADER,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/core/session"

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

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies()
  const token = await ensureAccessToken()

  if (!token) {
    return null
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  })
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  if (refreshToken) {
    headers.set(CURRENT_REFRESH_TOKEN_HEADER, refreshToken)
  }

  const res = await fetch(coreRoutes.account.user, {
    method: "GET",
    headers,
    cache: "no-store",
  })

  if (res.status >= 400 && res.status < 500) {
    return null
  }

  if (!res.ok) {
    throw new Error("Failed to load current user.")
  }

  return res.json()
})

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

export type AccountDeviceSession = {
  familyId: string
  device: string
  location: string
  createdAt: string
  expiresAt: string
}

export type AccountDevices = {
  current: AccountDeviceSession | null
  active: AccountDeviceSession[]
}

export async function getUserProfile(
  username: string
): Promise<UserProfile | null> {
  const res = await fetch(coreRoutes.users.user(username), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to load profile for "${username}"`)
  }

  return res.json()
}

export const getCurrentUserDevices = cache(
  async (): Promise<AccountDevices | null> => {
    const token = await ensureAccessToken()

    if (!token) {
      return null
    }

    const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE_NAME)?.value
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    if (refreshToken) {
      headers.set("X-Current-Refresh-Token", refreshToken)
    }

    const res = await fetch(coreRoutes.account.devices, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (res.status >= 400 && res.status < 500) {
      return null
    }

    if (!res.ok) {
      throw new Error("Failed to load current user devices.")
    }

    const body = (await res.json()) as {
      success?: boolean
      data?: AccountDevices
    }

    if (!body.success || !body.data) {
      throw new Error("Invalid current user devices response.")
    }

    return body.data
  }
)
