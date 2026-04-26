import type { ResponderErrorResponse, ResponderFieldError } from "./responder-types"

export function createValidationError(
  fields: ResponderFieldError[],
  message = "Validation failed."
): ResponderErrorResponse {
  return {
    success: false,
    error: {
      code: "validation_failed",
      message,
      fields,
    },
  }
}

export function toFieldErrorMap(response: ResponderErrorResponse) {
  return Object.fromEntries(
    (response.error.fields ?? []).map((item) => [item.field, item.message])
  ) as Record<string, string>
}
