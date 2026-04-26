import "server-only"

export function coreUrl(path: string) {
  return `${process.env.API_URL}${path}`
}

export const coreRoutes = {
  auth: {
    login: coreUrl("/auth/login"),
    refresh: coreUrl("/auth/refresh"),
    logout: coreUrl("/auth/logout"),
    logoutAll: coreUrl("/auth/logout-all"),
    register: coreUrl("/auth/register"),
    emailConfirm: coreUrl("/auth/email/confirm"),
    passwordForgot: coreUrl("/auth/password/forgot"),
    passwordRestore: coreUrl("/auth/password/restore"),
    tokenCheck: coreUrl("/auth/token/check"),
  },
  account: {
    user: coreUrl("/account/user"),
    settings: coreUrl("/account/settings"),
    devices: coreUrl("/account/devices"),
    password: coreUrl("/account/password"),
  },
  users: {
    user: (username: string) =>
      coreUrl(`/users/${encodeURIComponent(username)}/profile`),
  },
} as const
