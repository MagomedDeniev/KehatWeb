export type ApiFieldError = {
  field: string
  message: string
}

export type ApiError = {
  code: string
  message: string
  fields?: ApiFieldError[]
}

export type ApiErrorResponse = {
  success: false
  error: ApiError
}
