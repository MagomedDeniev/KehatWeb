"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { showToast } from "@/lib/toast"
import { toFieldErrorMap } from "@/lib/api/form-errors"
import {
  toRestorePasswordRequestBody,
  validateRestorePasswordPayload,
} from "@/lib/validators/restore-password"

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
        const res = await fetch("/api/auth/check-token", {
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
          router.replace("/login")
          return
        }

        setTokenValid(true)
      } catch {
        if (cancelled) {
          return
        }

        showToast({
          type: "error",
          title: "Ошибка сервера",
          description: "Проблема со связью или с сервером.",
        })
        router.replace("/login")
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const formPayload = {
        password: String(formData.get("password") ?? ""),
        confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
      }

      const validationError = validateRestorePasswordPayload(formPayload)

      if (validationError) {
        setFieldErrors(toFieldErrorMap(validationError))
        return
      }

      const res = await fetch("/api/auth/restore-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toRestorePasswordRequestBody(token, formPayload)),
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
        const nextFieldErrors = toFieldErrorMap(data)
        setFieldErrors(nextFieldErrors)

        if (Object.keys(nextFieldErrors).length === 0) {
          showToast({
            type: "error",
            title: "Не удалось обновить пароль",
            description:
              data.error?.message ??
              data.message ??
              "Попробуйте запросить новую ссылку восстановления.",
          })
        }

        return
      }

      showToast({
        type: "success",
        title: "Пароль обновлен",
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
              <Field>
                <Field className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      aria-invalid={!!fieldErrors.password}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmedPassword">
                      Подтвердить пароль
                    </FieldLabel>
                    <Input
                      id="confirmedPassword"
                      name="confirmedPassword"
                      type="password"
                      aria-invalid={!!fieldErrors.password}
                    />
                  </Field>
                </Field>

                {fieldErrors.password ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.password}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Сохранение..." : "Сохранить новый пароль"}
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
