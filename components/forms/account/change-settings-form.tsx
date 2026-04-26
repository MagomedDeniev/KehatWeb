"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
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
import { FormDate, FormGender, FormInput } from "@/components/forms/fields"
import { validateSettingsForm } from "@/lib/validation/validators/change-settings-validator"

type SettingsFormProps = React.ComponentProps<"div"> & {
  initialValues: {
    email: string
    username: string
    gender: string
    birthDate: string
  }
}

export function ChangeSettingsForm({
  initialValues,
  className,
  ...props
}: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      // Собираем все значения полей формы
      const formData = new FormData(e.currentTarget)

      const form = validateSettingsForm(formData)

      if (!form.success) {
        setFieldErrors(toFieldErrorMap(form))
        return
      }

      const res = await fetch(apiRoutes.account.settings, {
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

      router.replace(`/user/${form.data.username}`)
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
          <CardTitle className="text-xl">Настройки аккаунта</CardTitle>
          <CardDescription>Измените данные своего аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FormInput
                label="Имя пользователя"
                name="username"
                error={fieldErrors.username}
                defaultValue={initialValues.username}
              />

              <FormGender
                label="Пол"
                name="gender"
                error={fieldErrors.gender}
                defaultValue={initialValues.gender}
              />

              <FormDate
                label="Дата рождения"
                name="birthDate"
                error={fieldErrors.birthDate}
                defaultValue={initialValues.birthDate}
              />

              <FormInput
                label="Электронная почта"
                name="email"
                type="email"
                error={fieldErrors.email}
                defaultValue={initialValues.email}
              />

              <div className="flex items-center justify-between gap-3">
                <Button type="submit" disabled={loading} className="w-auto">
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>

                <Button variant="ghost" asChild className="w-auto">
                  <Link href={viewRoutes.user.profile(initialValues.username)}>
                    Отмена
                  </Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Вы также можете{" "}
        <Link href={viewRoutes.user.password(initialValues.username)}>
          изменить свой пароль
        </Link>
        .
      </FieldDescription>
    </div>
  )
}
