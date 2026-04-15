import { createValidationError } from "@/lib/api/form-errors"
import type { ApiErrorResponse, ApiFieldError } from "@/lib/api/types"

export type RegisterFormPayload = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
  confirmedPassword: string
}

export type RegisterRequestBody = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
}

export function toRegisterRequestBody(
  payload: RegisterFormPayload
): RegisterRequestBody
{
  return {
    username: payload.username,
    gender: payload.gender,
    birthDate: payload.birthDate,
    email: payload.email,
    password: payload.password,
  }
}

export function validateRegisterPayload(
  payload: RegisterFormPayload
): ApiErrorResponse | null
{
  const fields: ApiFieldError[] = []

  if (payload.username.trim().length < 8) {
    fields.push({
      field: "username",
      message: "Имя пользователя должно содержать минимум 8 символов.",
    })
  }

  if (!payload.email.trim()) {
    fields.push({
      field: "email",
      message: "Указание электронной почты обязательное.",
    })
  }

  if (!payload.birthDate) {
    fields.push({
      field: "birthDate",
      message: "Указание даты рождения обязательное.",
    })
  }

  if (payload.gender !== "male" && payload.gender !== "female") {
    fields.push({
      field: "gender",
      message: "Указание пола обязательное.",
    })
  }

  if (payload.password.trim().length < 8) {
    fields.push({
      field: "password",
      message: "Пароль должен содержать минимум 8 символов.",
    })
  }

  if (payload.password !== payload.confirmedPassword) {
    fields.push({
      field: "password",
      message: "Пароли не совпадают.",
    })
  }

  if (fields.length === 0) {
    return null
  }

  return createValidationError(fields)
}
