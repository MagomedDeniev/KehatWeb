"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { showToast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type LogoutButtonProps = {
  variant?: "dropdown" | "button"
  className?: string
}

export function LogoutButton({
  variant = "dropdown",
  className,
}: LogoutButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
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

      setOpen(false)
      router.push("/login")
      router.refresh()
    } catch {
      showToast({
        type: "error",
        title: "Ошибка сервера",
        description: "Не удалось выйти из аккаунта.",
      })
    } finally {
      setLoading(false)
    }
  }

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
          {loading ? "Выходим..." : "Выйти"}
        </DropdownMenuItem>
      ) : (
        <Button
          type="button"
          variant="destructive"
          className={className}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          {loading ? "Выходим..." : "Выйти"}
        </Button>
      )}

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
          <AlertDialogDescription>
            Текущая сессия будет завершена на этом устройстве.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Выходим..." : "Выйти"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
