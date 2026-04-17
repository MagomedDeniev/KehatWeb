"use client"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  validateRegisterPayload,
  toRegisterRequestBody,
} from "@/lib/validators/register"
import { toFieldErrorMap } from "@/lib/api/form-errors"
import { showToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [gender, setGender] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthYear, setBirthYear] = useState("")
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
        username: String(formData.get("username") ?? ""),
        gender: String(formData.get("gender") ?? ""),
        birthDate: String(formData.get("birthDate") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
      }

      const validationError = validateRegisterPayload(formPayload)

      if (validationError) {
        setFieldErrors(toFieldErrorMap(validationError))
        return
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toRegisterRequestBody(formPayload)),
      })

      const data = await res.json()

      if (data.error && data.error.code == "server_error") {
        showToast({
          type: "error",
          title: "Ошибка сервера",
          description: "Проблема со связью или с сервером."
        })
      }

      if (!res.ok || !data.success) {
        setFieldErrors(toFieldErrorMap(data))
        return
      }

      showToast({
        type: "success",
        title: "Успешная регистрация",
        description: data.message,
      })
      router.push("/")
      router.refresh()
    } catch {
      showToast({
        type: "error",
        title: "Ошибка сервера",
        description: "Проблема со связью или с сервером."
      })
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
              <Field>
                <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  aria-invalid={!!fieldErrors.username}
                />
                {fieldErrors.username ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.username}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Пол</FieldLabel>
                <RadioGroup
                  className="flex gap-6 pt-2"
                  value={gender}
                  onValueChange={setGender}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="male"
                      id="gender-male"
                      aria-invalid={!!fieldErrors.gender}
                    />
                    <Label htmlFor="gender-male">Мужской</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="female"
                      id="gender-female"
                      aria-invalid={!!fieldErrors.gender}
                    />
                    <Label htmlFor="gender-female">Женский</Label>
                  </div>
                </RadioGroup>
                <input type="hidden" name="gender" value={gender} />
                {fieldErrors.gender ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.gender}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <FieldLabel>Дата рождения</FieldLabel>

                <div className="grid grid-cols-3 gap-3">
                  <Select value={birthDay} onValueChange={setBirthDay}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!fieldErrors.birthDate}
                    >
                      <SelectValue placeholder="День" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = String(i + 1)
                        return (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  <Select value={birthMonth} onValueChange={setBirthMonth}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!fieldErrors.birthDate}
                    >
                      <SelectValue placeholder="Месяц" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Январь</SelectItem>
                      <SelectItem value="02">Февраль</SelectItem>
                      <SelectItem value="03">Март</SelectItem>
                      <SelectItem value="04">Апрель</SelectItem>
                      <SelectItem value="05">Май</SelectItem>
                      <SelectItem value="06">Июнь</SelectItem>
                      <SelectItem value="07">Июль</SelectItem>
                      <SelectItem value="08">Август</SelectItem>
                      <SelectItem value="09">Сентябрь</SelectItem>
                      <SelectItem value="10">Октябрь</SelectItem>
                      <SelectItem value="11">Ноябрь</SelectItem>
                      <SelectItem value="12">Декабрь</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={birthYear} onValueChange={setBirthYear}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!fieldErrors.birthDate}
                    >
                      <SelectValue placeholder="Год" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = String(new Date().getFullYear() - i)
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <input
                  type="hidden"
                  name="birthDate"
                  value={
                    birthYear && birthMonth && birthDay
                      ? `${birthYear}-${birthMonth}-${birthDay.padStart(2, "0")}`
                      : ""
                  }
                />
                {fieldErrors.birthDate ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.birthDate}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Электронная почта</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.email}
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
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
                  {loading ? "Регистрация..." : "Создать аккаунт"}
                </Button>
                <FieldDescription className="text-center">
                  Уже есть свой аккаунт? <Link href="/login">Войдите</Link>
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
