import {
  notBlank,
  minLength,
  maxLength,
  matchesRegex,
  isEnum,
  isDate,
  equals,
  isEmail,
} from "@/lib/validation/constraints"

const validationRules = {
  username: {
    min: 8,
    max: 180,
    regex: /^[a-z0-9._]+$/i,
  },
  email: {
    min: 8,
    max: 80,
  },
  password: {
    min: 8,
    max: 4096,
  },
} as const

export const fieldsRules = {
  username: [
    notBlank,
    minLength(validationRules.username.min),
    maxLength(validationRules.username.max),
    matchesRegex(
      validationRules.username.regex,
      "Только буквы, цифры, точка и подчёркивание"
    ),
  ],
  newEmail: [
    notBlank,
    isEmail,
    minLength(validationRules.email.min),
    maxLength(validationRules.email.max),
  ],
  currentEmail: [notBlank, isEmail],
  newPassword: [
    notBlank,
    minLength(validationRules.password.min),
    maxLength(validationRules.password.max),
  ],
  currentPassword: [notBlank],
  confirmedPassword: (password: string) => [
    notBlank,
    equals(password, "Пароли не совпадают"),
  ],
  gender: [isEnum(["male", "female"], "Выберите пол")],
  date: [notBlank, isDate],
}
