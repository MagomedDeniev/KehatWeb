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
  RadioGroup,
  RadioGroupItem,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

import { toFieldErrorMap } from "@/lib/api/form-errors"
import { showToast } from "@/components/shared/toast"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"

import {
  toSettingsRequestBody,
  validateSettingsPayload,
} from "@/lib/validators/change-settings"

import { apiRoutes, viewRoutes } from "@/lib/routes"

type SettingsFormProps = React.ComponentProps<"div"> & {
  initialValues: {
    email: string
    username: string
    gender: string
    birthDate: string
  }
}

function getBirthDateParts(birthDate: string) {
  const normalizedBirthDate = birthDate.split("T")[0] ?? ""
  const [birthYear = "", birthMonth = "", rawBirthDay = ""] =
    normalizedBirthDate.split("-")

  return {
    birthYear,
    birthMonth,
    birthDay: rawBirthDay ? String(Number(rawBirthDay)) : "",
  }
}

export function ChangeSettingsForm({
  initialValues,
  className,
  ...props
}: SettingsFormProps) {
  const initialBirthDate = getBirthDateParts(initialValues.birthDate)

  const [gender, setGender] = useState(initialValues.gender)
  const [birthDay, setBirthDay] = useState(initialBirthDate.birthDay)
  const [birthMonth, setBirthMonth] = useState(initialBirthDate.birthMonth)
  const [birthYear, setBirthYear] = useState(initialBirthDate.birthYear)
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
        username: String(formData.get("username") ?? ""),
        gender: String(formData.get("gender") ?? ""),
        birthDate: String(formData.get("birthDate") ?? ""),
      }

      const validationError = validateSettingsPayload(formPayload)

      if (validationError) {
        setFieldErrors(toFieldErrorMap(validationError))
        return
      }

      const res = await fetch(apiRoutes.account.settings, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSettingsRequestBody(formPayload)),
      })

      const data = await res.json()

      if (data.error && data.error.code === "server_error") {
        showToast({
          type: "error",
          title: "Ошибка сервера",
          description: "Проблема со связью или с сервером 1.",
        })
        return
      }

      if (!res.ok || !data.success) {
        const nextFieldErrors = toFieldErrorMap(data)
        setFieldErrors(nextFieldErrors)

        if (Object.keys(nextFieldErrors).length === 0) {
          showToast({
            type: "error",
            title: "Не удалось сохранить настройки",
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
        title: "Настройки изменены",
        description: data.message,
      })

      router.replace(`/user/${formPayload.username}`)
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
          <CardTitle className="text-xl">Настройки аккаунта</CardTitle>
          <CardDescription>Измените данные своего аккаунта</CardDescription>
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
                  defaultValue={initialValues.username}
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
                      id="settings-gender-male"
                      aria-invalid={!!fieldErrors.gender}
                    />
                    <Label htmlFor="settings-gender-male">Мужской</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="female"
                      id="settings-gender-female"
                      aria-invalid={!!fieldErrors.gender}
                    />
                    <Label htmlFor="settings-gender-female">Женский</Label>
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
                  defaultValue={initialValues.email}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email ? (
                  <FieldDescription className="text-sm text-red-500">
                    {fieldErrors.email}
                  </FieldDescription>
                ) : null}
              </Field>

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
