"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { showToast } from "@/lib/toast"

type Props = {
  token: string
  success: boolean
  message?: string
  errorType?: "invalid" | "server"
}

export function EmailConfirmationRedirect({
  token,
  success,
  message,
  errorType = "invalid",
}: Props) {
  const router = useRouter()

  useEffect(() => {
    const storageKey = `email-confirmation:${token}`

    if (sessionStorage.getItem(storageKey) === "handled") {
      router.replace("/login")
      return
    }

    sessionStorage.setItem(storageKey, "handled")

    if (success) {
      showToast({
        type: "success",
        title: "Почта подтверждена",
        description: message ?? "Электронная почта успешно подтверждена.",
      })
    } else if (errorType === "server") {
      showToast({
        type: "error",
        title: "Ошибка сервера",
        description: "Проблема со связью или с сервером.",
      })
    } else {
      showToast({
        type: "error",
        title: "Ссылка недействительна",
        description:
          "Ссылка подтверждения недействительна или истекла. Повторите попытку позже.",
      })
    }

    router.replace("/login")
  }, [errorType, message, router, success, token])

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Подтверждение почты</CardTitle>
        <CardDescription>Обрабатываем ссылку подтверждения...</CardDescription>
      </CardHeader>
    </Card>
  )
}
