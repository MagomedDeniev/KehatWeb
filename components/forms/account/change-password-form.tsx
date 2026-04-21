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
  FieldLabel,
  Input,
} from "@/components/ui"

import { toFieldErrorMap } from "@/lib/api/form-errors"
import { showToast } from "@/components/shared/toast"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"

import {
  toChangePasswordRequestBody,
  validateChangePasswordPayload,
} from "@/lib/validators/change-password"

import { apiRoutes, viewRoutes } from "@/lib/routes"

type ChangePasswordFormProps = React.ComponentProps<"div"> & {
  username: string
}

export function ChangePasswordForm({
  username,
  className,
  ...props
}: ChangePasswordFormProps) {
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
        currentPassword: String(formData.get("currentPassword") ?? ""),
        newPassword: String(formData.get("newPassword") ?? ""),
        confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
      }

      const validationError = validateChangePasswordPayload(formPayload)

      if (validationError) {
        setFieldErrors(toFieldErrorMap(validationError))
        return
      }

      const res = await fetch(apiRoutes.account.password, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toChangePasswordRequestBody(formPayload)),
      })

      const data = await res.json()

      if (data.error && data.error.code === "server_error") {
        showToast({
          type: "error",
          title: "Ошибка сервера",
          description: "Проблема со связью или с сервером.",
        })
        return
      }

      if (!res.ok || !data.success) {
        const nextFieldErrors = toFieldErrorMap(data)
        setFieldErrors(nextFieldErrors)

        if (Object.keys(nextFieldErrors).length === 0) {
          showToast({
            type: "error",
            title: "Не удалось изменить пароль",
            description:
              data.error?.message ??
              data.message ??
              "Проверьте данные и попробуйте еще раз.",
          })
        }

        return
      }

      showToast({
        type: "success",
        title: "Пароль изменен",
        description: data.message,
      })

      router.replace(`/user/${username}`)
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
          <CardTitle className="text-xl">Изменение пароля</CardTitle>
          <CardDescription>
            Укажите текущий пароль и задайте новый
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="currentPassword">
                  Текущий пароль
                </FieldLabel>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  aria-invalid={!!fieldErrors.currentPassword}
                />
                {fieldErrors.currentPassword ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.currentPassword}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="newPassword">Новый пароль</FieldLabel>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  aria-invalid={!!fieldErrors.newPassword}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmedPassword">
                  Повторите новый пароль
                </FieldLabel>
                <Input
                  id="confirmedPassword"
                  name="confirmedPassword"
                  type="password"
                  aria-invalid={!!fieldErrors.newPassword}
                />
              </Field>

              {fieldErrors.newPassword ? (
                <FieldDescription className="text-sm text-red-500">
                  {fieldErrors.newPassword}
                </FieldDescription>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>

                <Button variant="ghost" asChild className="w-auto">
                  <Link href={viewRoutes.user.profile(username)}>Отмена</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Вы также можете{" "}
        <Link href={viewRoutes.user.settings(username)}>
          вернуться к настройкам
        </Link>
        .
      </FieldDescription>
    </div>
  )
}
