import type { ResponderErrorResponse, ResponderFieldError } from "@/lib/validation/responder-types"
import { createValidationError } from "@/lib/validation/form-errors"
import { fieldsRules } from "@/lib/validation/rules"

// То что приходит из формы
export type SettingsFormRequest = {
  username: string
  gender: string
  birthDate: string
  email: string
}

// То что уходит в API
export type SettingsFormResponse = {
  username: string
  gender: string
  birthDate: string
  email: string
}

// Парсим formData в нужный тип
export function parseSettingsData(formData: FormData): SettingsFormRequest {
  return {
    username: String(formData.get("username") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    email: String(formData.get("email") ?? ""),
  }
}

// Валидируем и возвращаем либо ошибки, либо чистые данные для API
export function validateSettingsForm(
  formData: FormData
): ResponderErrorResponse | { success: true; data: SettingsFormResponse } {
  const data = parseSettingsData(formData)

  const rules: {
    [K in keyof SettingsFormRequest]: Array<(v: string) => string | null>
  } = {
    username: fieldsRules.username,
    gender: fieldsRules.gender,
    birthDate: fieldsRules.date,
    email: fieldsRules.newEmail,
  }

  const fields: ResponderFieldError[] = []

  for (const field in rules) {
    const key = field as keyof SettingsFormRequest

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
      username: data.username,
      gender: data.gender,
      birthDate: data.birthDate,
      email: data.email,
    },
  }
}
