"use client"

import { cn } from "@/lib/utils"
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui"
import { showToast } from "@/components/shared/toast"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"
import { apiRoutes } from "@/lib/routes/api-routes"
import { viewRoutes } from "@/lib/routes/view-routes"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(apiRoutes.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast({
          type: "error",
          title: data.message ?? "Ошибка входа",
        })
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      showToast({
        type: "error",
        title: "Ошибка входа",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Войдите в свой аккаунт</CardTitle>
          <CardDescription>
            Введите свою почту или имя пользователя
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Электронная почта</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <Link
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    href={viewRoutes.auth.passwordForgot}
                  >
                    Забыл пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Авторизация..." : "Войти"}
                </Button>
                <FieldDescription className="text-center">
                  Еще не зарегистрированы?{" "}
                  <Link href={viewRoutes.auth.register}>Зарегистрируйтесь</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Авторизуясь в аккаунт, вы соглашаетесь с{" "}
        <a href="#">Условиями обслуживания</a> и{" "}
        <a href="#">Политикой конфиденциальности</a>.
      </FieldDescription>
    </div>
  )
}
