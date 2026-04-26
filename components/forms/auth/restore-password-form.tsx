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
import { showDefaultToast, showToast } from "@/components/shared/toast"
import { toFieldErrorMap } from "@/lib/validation/form-errors"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiRoutes } from "@/lib/routes/api-routes"
import { viewRoutes } from "@/lib/routes/view-routes"
import { validateRestorePasswordForm } from "@/lib/validation/validators/restore-password-validator"
import { FormPasswordPair } from "@/components/forms/fields"

type RestorePasswordFormProps = React.ComponentProps<"div"> & {
  token: string
}

export function RestorePasswordForm({
  token,
  className,
  ...props
}: RestorePasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function checkToken() {
      try {
        const res = await fetch(apiRoutes.auth.tokenCheck, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            type: "password",
          }),
        })

        const data = await res.json()

        if (cancelled) {
          return
        }

        if (!data.success) {
          showToast({
            type: "error",
            title: "Ссылка недействительна",
            description:
              "Ссылка для восстановления пароля недействительна или истекла.",
          })
          router.replace("/auth/login")
          return
        }

        setTokenValid(true)
      } catch {
        if (cancelled) {
          return
        }

        showDefaultToast("serverError")
        router.replace("/auth/login")
      } finally {
        if (!cancelled) {
          setCheckingToken(false)
        }
      }
    }

    void checkToken()

    return () => {
      cancelled = true
    }
  }, [router, token])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("token", token)

      const form = validateRestorePasswordForm(formData)

      if (!form.success) {
        setFieldErrors(toFieldErrorMap(form))
        return
      }

      const res = await fetch(apiRoutes.auth.passwordRestore, {
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

  if (checkingToken) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Проверка ссылки</CardTitle>
            <CardDescription>
              Проверяем ссылку восстановления пароля...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!tokenValid) {
    return null
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Новый пароль</CardTitle>
          <CardDescription>
            Укажите новый пароль для вашего аккаунта
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FormPasswordPair error={fieldErrors.password} />
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Сохранение..." : "Сохранить новый пароль"}
                </Button>
                <FieldDescription className="text-center">
                  <Link href={viewRoutes.auth.login}>Вернуться ко входу</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
