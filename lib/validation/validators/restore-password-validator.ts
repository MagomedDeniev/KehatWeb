import type { ResponderErrorResponse, ResponderFieldError } from "@/lib/validation/responder-types"
import { createValidationError } from "@/lib/validation/form-errors"
import { fieldsRules } from "@/lib/validation/rules"

// То что приходит из формы
export type RestorePasswordFormRequest = {
  token: string
  password: string
  confirmedPassword: string
}

// То что уходит в API
export type RestorePasswordFormResponse = {
  token: string
  password: string
}

// Парсим formData в нужный тип
export function parseRestorePasswordFormData(formData: FormData): RestorePasswordFormRequest {
  return {
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
  }
}

// Валидируем и возвращаем либо ошибки, либо чистые данные для API
export function validateRestorePasswordForm(
  formData: FormData
): ResponderErrorResponse | { success: true; data: RestorePasswordFormResponse } {
  const data = parseRestorePasswordFormData(formData);

  const rules: {
    [K in keyof RestorePasswordFormRequest]: Array<(v: string) => string | null>
  } = {
    token: [],
    password: fieldsRules.newPassword,
    confirmedPassword: fieldsRules.confirmedPassword(data.password),
  }

  const fields: ResponderFieldError[] = []

  for (const field in rules) {
    const key = field as keyof RestorePasswordFormRequest

    for (const validator of rules[key]) {
      const error = validator(data[key])

      if (error) {
        fields.push({
          field: key === "confirmedPassword" ? "password" : key,
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
      token: data.token,
      password: data.password,
    },
  }
}
