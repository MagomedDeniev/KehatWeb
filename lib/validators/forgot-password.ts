import { createValidationError } from "@/lib/api/form-errors"
import type { ApiErrorResponse, ApiFieldError } from "@/lib/api/types"

export type ForgotPasswordPayload = {
  email: string
}

export function validateForgotPasswordPayload(
  payload: ForgotPasswordPayload
): ApiErrorResponse | null {
  const fields: ApiFieldError[] = []

  if (!payload.email.trim()) {
    fields.push({
      field: "email",
      message: "Указание электронной почты обязательное.",
    })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    fields.push({
      field: "email",
      message: "Некорректный формат электронной почты.",
    })
  }

  if (fields.length === 0) {
    return null
  }

  return createValidationError(fields)
}
