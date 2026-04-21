export const apiRoutes = {
  // Неавторизованный пользователь
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    passwordForgot: "/api/auth/forgot-password",
    passwordRestore: "/api/auth/restore-password",
    tokenCheck: "/api/auth/check-token",
  },
  // Текущий пользователь
  account: {
    settings: "/api/account/settings",
    password: "/api/account/password",
  },
} as const

export const viewRoutes = {
  // Неавторизованный пользователь
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    passwordForgot: "/auth/forgot-password",
    passwordRestore: (token: string) => `/auth/restore-password/${token}`,
    emailConfirm: (token: string) => `/auth/email-confirmation/${token}`,
  },
  // Текущий и другой пользователь
  user: {
    profile: (username: string) => `/user/${username}`,
    settings: (username: string) => `/user/${username}/settings`,
    password: (username: string) => `/user/${username}/password`,
  },
} as const
