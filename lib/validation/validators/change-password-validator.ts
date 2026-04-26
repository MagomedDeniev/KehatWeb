import type { ResponderErrorResponse, ResponderFieldError } from "@/lib/validation/responder-types"
import { createValidationError } from "@/lib/validation/form-errors"
import { fieldsRules } from "@/lib/validation/rules"

// То что приходит из формы
export type PasswordFormRequest = {
  currentPassword: string
  newPassword: string
  confirmedPassword: string
}

// То что уходит в API
export type PasswordFormResponse = {
  currentPassword: string
  newPassword: string
}

// Парсим formData в нужный тип
export function parsePasswordFormData(formData: FormData): PasswordFormRequest {
  return {
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
  }
}

// Валидируем и возвращаем либо ошибки, либо чистые данные для API
export function validatePasswordForm(
  formData: FormData
): ResponderErrorResponse | { success: true; data: PasswordFormResponse } {
  const data = parsePasswordFormData(formData);

  const rules: {
    [K in keyof PasswordFormRequest]: Array<(v: string) => string | null>
  } = {
    currentPassword: fieldsRules.currentPassword,
    newPassword: fieldsRules.newPassword,
    confirmedPassword: fieldsRules.confirmedPassword(data.newPassword),
  }

  const fields: ResponderFieldError[] = []

  for (const field in rules) {
    const key = field as keyof PasswordFormRequest

    for (const validator of rules[key]) {
      const error = validator(data[key])

      if (error) {
        fields.push({
          field: key === "confirmedPassword" ? "newPassword" : key,
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
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    },
  }
}
