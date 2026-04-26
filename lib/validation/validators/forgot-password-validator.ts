import type { ResponderErrorResponse, ResponderFieldError } from "@/lib/validation/responder-types"
import { createValidationError } from "@/lib/validation/form-errors"
import { fieldsRules } from "@/lib/validation/rules"

// То что приходит из формы
export type ForgotPasswordFormRequest = {
  email: string
}

// То что уходит в API
export type ForgotPasswordFormResponse = {
  email: string
}

// Парсим formData в нужный тип
export function parseForgotPasswordData(formData: FormData): ForgotPasswordFormRequest {
  return {
    email: String(formData.get("email") ?? ""),
  }
}

// Валидируем и возвращаем либо ошибки, либо чистые данные для API
export function validateForgotPasswordForm(
  formData: FormData
): ResponderErrorResponse | { success: true; data: ForgotPasswordFormResponse } {
  const data = parseForgotPasswordData(formData)

  const rules: {
    [K in keyof ForgotPasswordFormRequest]: Array<(v: string) => string | null>
  } = {
    email: fieldsRules.currentEmail,
  }

  const fields: ResponderFieldError[] = []

  for (const field in rules) {
    const key = field as keyof ForgotPasswordFormRequest

    for (const validator of rules[key]) {
      const error = validator(data[key])

      if (error) {
        fields.push({
          field: key,
          message: error,
        })
        // Прерываем при первой ошибке одного поля, чтобы не видеть все ошибки одновременно
        break
      }
    }
  }

  if (fields.length > 0) {
    return createValidationError(fields)
  }

  return {
    success: true,
    data: {
      email: data.email,
    },
  }
}
