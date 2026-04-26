import type { ResponderErrorResponse, ResponderFieldError } from "@/lib/validation/responder-types"
import { createValidationError } from "@/lib/validation/form-errors"
import { fieldsRules } from "@/lib/validation/rules"

// То что приходит из формы
export type RegisterFormRequest = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
  confirmedPassword: string
}

// То что уходит в API
export type RegisterFormResponse = {
  username: string
  gender: string
  birthDate: string
  email: string
  password: string
}

// Парсим formData в нужный тип
export function parseRegisterFormData(formData: FormData): RegisterFormRequest {
  return {
    username: String(formData.get("username") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmedPassword: String(formData.get("confirmedPassword") ?? ""),
  }
}

// Валидируем и возвращаем либо ошибки, либо чистые данные для API
export function validateRegisterForm(
  formData: FormData
): ResponderErrorResponse | { success: true; data: RegisterFormResponse } {
  const data = parseRegisterFormData(formData);

  const rules: {
    [K in keyof RegisterFormRequest]: Array<(v: string) => string | null>
  } = {
    username: fieldsRules.username,
    gender: fieldsRules.gender,
    birthDate: fieldsRules.date,
    email: fieldsRules.newEmail,
    password: fieldsRules.newPassword,
    confirmedPassword: fieldsRules.confirmedPassword(data.password),
  }

  const fields: ResponderFieldError[] = []

  for (const field in rules) {
    const key = field as keyof RegisterFormRequest

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
      username: data.username,
      gender: data.gender,
      birthDate: data.birthDate,
      email: data.email,
      password: data.password,
    },
  }
}
