import { createValidationError } from "@/lib/api/form-errors"
import type { ApiErrorResponse, ApiFieldError } from "@/lib/api/types"

export type RestorePasswordPayload = {
  password: string
  confirmedPassword: string
}

export type RestorePasswordRequestBody = {
  token: string
  password: string
}

export function validateRestorePasswordPayload(
  payload: RestorePasswordPayload
): ApiErrorResponse | null {
  const fields: ApiFieldError[] = []

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

export function toRestorePasswordRequestBody(
  token: string,
  payload: RestorePasswordPayload
): RestorePasswordRequestBody {
  return {
    token,
    password: payload.password,
  }
}
