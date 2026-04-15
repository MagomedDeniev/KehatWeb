"use client"

import { cn } from "@/lib/utils"
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
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
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
        setError(data.message ?? "Ошибка входа")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Ошибка сети")
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
        {error ? (
          <CardContent>
            <Field>
              <FieldDescription className="text-sm text-red-500">
                {error}
              </FieldDescription>
            </Field>
          </CardContent>
        ) : null}
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
                      href="/forgot-password"
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
                  <Link href="/register">Зарегистрируйтесь</Link>
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
