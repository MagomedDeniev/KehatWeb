export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    logoutAll: "/api/auth/logout-all",
    register: "/api/auth/register",
    passwordForgot: "/api/auth/forgot-password",
    passwordRestore: "/api/auth/restore-password",
    tokenCheck: "/api/auth/check-token",
  },
  account: {
    settings: "/api/account/settings",
    password: "/api/account/password",
  },
} as const
