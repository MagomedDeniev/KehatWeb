export type ResponderFieldError = {
  field: string
  message: string
}

export type ResponderError = {
  code: string
  message: string
  fields?: ResponderFieldError[]
}

export type ResponderErrorResponse = {
  success: false
  error: ResponderError
}
