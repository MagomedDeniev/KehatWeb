"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Logout failed")
      }

      router.push("/login")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenuItem onSelect={handleLogout} disabled={loading}>
      {loading ? "Выходим..." : "Выйти"}
    </DropdownMenuItem>
  )
}
