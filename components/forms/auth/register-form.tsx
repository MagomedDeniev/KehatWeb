"use client"

import { cn } from "@/lib/utils"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldDescription,
  FieldGroup,
  Field,
} from "@/components/ui"
import {
  FormDate,
  FormGender,
  FormInput,
  FormPasswordPair,
} from "@/components/forms/fields"
import { toFieldErrorMap } from "@/lib/validation/form-errors"
import { showDefaultToast, showToast } from "@/components/shared/toast"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"
import { validateRegisterForm } from "@/lib/validation/validators/register-validator"
import { apiRoutes } from "@/lib/routes/api-routes"
import { viewRoutes } from "@/lib/routes/view-routes"

export function RegisterForm({
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
      // Собираем все значения полей формы
      const formData = new FormData(e.currentTarget)

      const form = validateRegisterForm(formData)

      if (!form.success) {
        setFieldErrors(toFieldErrorMap(form))
        return
      }

      const res = await fetch(apiRoutes.auth.register, {
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

      router.push("/")
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
          <CardTitle className="text-xl">Создать свой аккаунт</CardTitle>
          <CardDescription>
            Введите свои данные чтобы создать аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FormInput
                label="Имя пользователя"
                name="username"
                error={fieldErrors.username}
              />

              <FormGender
                label="Пол"
                name="gender"
                error={fieldErrors.gender}
              />

              <FormDate
                label="Дата рождения"
                name="birthDate"
                error={fieldErrors.birthDate}
              />

              <FormInput
                label="Электронная почта"
                name="email"
                type="email"
                error={fieldErrors.email}
              />

              <FormPasswordPair error={fieldErrors.password} />

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Регистрация..." : "Создать аккаунт"}
                </Button>
                <FieldDescription className="text-center">
                  Уже есть свой аккаунт?{" "}
                  <Link href={viewRoutes.auth.login}>Войдите</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Проходя регистрацию, вы соглашаетесь с{" "}
        <a href="#">Условиями обслуживания</a> и{" "}
        <a href="#">Политикой конфиденциальности</a>.
      </FieldDescription>
    </div>
  )
}
