"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { showToast } from "@/lib/toast"
import { toFieldErrorMap } from "@/lib/api/form-errors"
import { validateForgotPasswordPayload } from "@/lib/validators/forgot-password"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const formPayload = {
        email: String(formData.get("email") ?? ""),
      }

      const validationError = validateForgotPasswordPayload(formPayload)

      if (validationError) {
        setFieldErrors(toFieldErrorMap(validationError))
        return
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      })

      const data = await res.json()

      if (data.error && data.error.code === "server_error") {
        showToast({
          type: "error",
          title: "Ошибка сервера",
          description: "Проблема со связью или с сервером.",
        })
      }

      if (!res.ok || !data.success) {
        setFieldErrors(toFieldErrorMap(data))
        return
      }

      showToast({
        type: "success",
        title: "Письмо отправлено",
        description: data.message,
      })

      router.push("/login")
      router.refresh()
    } catch {
      showToast({
        type: "error",
        title: "Ошибка сервера",
        description: "Проблема со связью или с сервером.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Восстановление пароля</CardTitle>
          <CardDescription>
            Введите электронную почту, чтобы получить письмо для сброса пароля
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Электронная почта</FieldLabel>
                <Input
                  id="email"
                  name="email"

                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.email}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить письмо"}
                </Button>
                <FieldDescription className="text-center">
                  <Link href="/login">Вернуться ко входу</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
