export const viewRoutes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    passwordForgot: "/auth/forgot-password",
    passwordRestore: (token: string) => `/auth/restore-password/${token}`,
    emailConfirm: (token: string) => `/auth/email-confirmation/${token}`,
  },
  user: {
    profile: (username: string) => `/user/${username}`,
    edit: (username: string) => `/user/${username}/edit`,
    devices: (username: string) => `/user/${username}/devices`,
    settings: (username: string) => `/user/${username}/settings`,
    password: (username: string) => `/user/${username}/password`,
  },
} as const
