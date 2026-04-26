"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui"
import { toFieldErrorMap } from "@/lib/validation/form-errors"
import { showDefaultToast, showToast } from "@/components/shared/toast"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"
import { apiRoutes } from "@/lib/routes/api-routes"
import { viewRoutes } from "@/lib/routes/view-routes"
import { FormInput } from "@/components/forms/fields"
import { validateForgotPasswordForm } from "@/lib/validation/validators/forgot-password-validator"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const form = validateForgotPasswordForm(formData)

      if (!form.success) {
        setFieldErrors(toFieldErrorMap(form))
        return
      }

      const res = await fetch(apiRoutes.auth.passwordForgot, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.data),
      })

      const data = await res.json()

      if (data.error && data.error.code === "server_error") {
        showDefaultToast("serverError")
        return
      }

      // API возвращает ошибки, которые могут быть проверены только после отправки запроса
      if (!res.ok || !data.success) {
        const nextFieldErrors = toFieldErrorMap(data)
        setFieldErrors(nextFieldErrors)

        if (Object.keys(nextFieldErrors).length === 0) {
          showDefaultToast("serverError")
        }

        return
      }

      showToast({
        type: "success",
        title: data.message,
      })

      router.push("/auth/login")
      router.refresh()
    } catch {
      showDefaultToast("serverError")
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
              <FormInput
                label="Электронная почта"
                name="email"
                type="email"
                error={fieldErrors.email}
              />

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить письмо"}
                </Button>
                <FieldDescription className="text-center">
                  Вспомнили? <Link href={viewRoutes.auth.login}>Вернитесь ко входу</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
