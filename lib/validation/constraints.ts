type ValidationResult = string | null

export const notBlank = (value: string): ValidationResult =>
  value.trim() === "" ? "Поле не может быть пустым" : null

export const minLength =
  (min: number) =>
  (value: string): ValidationResult =>
    value.length < min ? `Минимум ${min} символов` : null

export const maxLength =
  (max: number) =>
  (value: string): ValidationResult =>
    value.length > max ? `Максимум ${max} символов` : null

export const matchesRegex =
  (regex: RegExp, message: string) =>
  (value: string): ValidationResult =>
    !regex.test(value) ? message : null

export const isEnum =
  (values: string[], message: string) =>
  (value: string): ValidationResult =>
    !values.includes(value) ? message : null

export const isDate = (value: string): ValidationResult =>
  isNaN(Date.parse(value)) ? "Некорректная дата" : null

export const equals =
  (other: string, message: string) =>
  (value: string): ValidationResult =>
    value !== other ? message : null

export const isEmail = (value: string): ValidationResult =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Некорректный email"
