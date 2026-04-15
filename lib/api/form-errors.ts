import type { ApiErrorResponse, ApiFieldError } from "./types"

export function createValidationError(
  fields: ApiFieldError[],
  message = "Validation failed."
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code: "validation_failed",
      message,
      fields,
    },
  }
}

export function toFieldErrorMap(response: ApiErrorResponse) {
  return Object.fromEntries(
    (response.error.fields ?? []).map((item) => [item.field, item.message])
  ) as Record<string, string>
}
