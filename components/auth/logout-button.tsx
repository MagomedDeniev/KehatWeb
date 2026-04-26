"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { showToast } from "@/components/shared/toast"
import {
  Button,
  DropdownMenuItem,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui"
import { apiRoutes } from "@/lib/routes/api-routes"

type LogoutButtonProps = {
  variant?: "dropdown" | "button"
  scope?: "current" | "all"
  className?: string
}

export function LogoutButton({
  variant = "dropdown",
  scope = "current",
  className,
}: LogoutButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isGlobalLogout = scope === "all"

  async function handleLogout() {
    try {
      setLoading(true)

      const res = await fetch(
        isGlobalLogout ? apiRoutes.auth.logoutAll : apiRoutes.auth.logout,
        {
          method: "POST",
        }
      )

      if (!res.ok) {
        throw new Error("Logout failed")
      }

      setOpen(false)
      router.push("/auth/login")
      router.refresh()
    } catch {
      showToast({
        type: "error",
        title: "Ошибка сервера",
        description: isGlobalLogout
          ? "Не удалось завершить все сеансы."
          : "Не удалось выйти из аккаунта.",
      })
    } finally {
      setLoading(false)
    }
  }

  const idleLabel = isGlobalLogout ? "Выйти везде" : "Выйти"
  const loadingLabel = isGlobalLogout ? "Завершаем..." : "Выходим..."

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {variant === "dropdown" ? (
        <DropdownMenuItem
          className={className}
          variant="destructive"
          onSelect={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
          disabled={loading}
        >
          {loading ? loadingLabel : idleLabel}
        </DropdownMenuItem>
      ) : (
        <Button
          type="button"
          variant="destructive"
          className={className}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          {loading ? loadingLabel : idleLabel}
        </Button>
      )}

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {isGlobalLogout
              ? "Выйти на всех устройствах?"
              : "Выйти из аккаунта?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isGlobalLogout
              ? "Все активные сеансы будут завершены. Для продолжения потребуется новый вход."
              : "Текущая сессия будет завершена на этом устройстве."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? loadingLabel : idleLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
