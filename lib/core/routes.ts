import "server-only"

export function coreUrl(path: string) {
  return `${process.env.API_URL}${path}`
}

export const corePaths = {
  // Неавторизованный пользователь
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    emailConfirm: "/auth/email/confirm",
    passwordForgot: "/auth/password/forgot",
    passwordRestore: "/auth/password/restore",
    tokenCheck: "/auth/token/check",
  },
  // Текущий пользователь
  account: {
    user: "/account/user",
    settings: "/account/settings",
    password: "/account/password",
  },
  // Другой пользователь
  users: {
    user: (username: string) =>
      `/users/${encodeURIComponent(username)}/profile`,
  },
} as const
