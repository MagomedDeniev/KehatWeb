import { createValidationError } from "@/lib/api/form-errors"
import type { ApiErrorResponse, ApiFieldError } from "@/lib/api/types"

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmedPassword: string
}

export type ChangePasswordRequestBody = {
  currentPassword: string
  newPassword: string
}

export function validateChangePasswordPayload(
  payload: ChangePasswordPayload
): ApiErrorResponse | null {
  const fields: ApiFieldError[] = []

  if (payload.currentPassword.trim().length < 8) {
    fields.push({
      field: "currentPassword",
      message: "Текущий пароль должен содержать минимум 8 символов.",
    })
  }

  if (payload.newPassword.trim().length < 8) {
    fields.push({
      field: "newPassword",
      message: "Новый пароль должен содержать минимум 8 символов.",
    })
  }

  if (payload.newPassword !== payload.confirmedPassword) {
    fields.push({
      field: "newPassword",
      message: "Новые пароли не совпадают.",
    })
  }

  if (fields.length === 0) {
    return null
  }

  return createValidationError(fields)
}

export function toChangePasswordRequestBody(
  payload: ChangePasswordPayload
): ChangePasswordRequestBody {
  return {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  }
}
