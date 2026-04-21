import { createValidationError } from "@/lib/api/form-errors"
import type { ApiErrorResponse, ApiFieldError } from "@/lib/api/types"

export type SettingsFormPayload = {
  email: string
  username: string
  gender: string
  birthDate: string
}

export type SettingsRequestBody = {
  email: string
  username: string
  gender: string
  birthDate: string
}

export function validateSettingsPayload(
  payload: SettingsFormPayload
): ApiErrorResponse | null {
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

  if (fields.length === 0) {
    return null
  }

  return createValidationError(fields)
}

export function toSettingsRequestBody(
  payload: SettingsFormPayload
): SettingsRequestBody {
  return {
    email: payload.email,
    username: payload.username,
    gender: payload.gender,
    birthDate: payload.birthDate,
  }
}
