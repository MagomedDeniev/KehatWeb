import { EmailConfirmationRedirect } from "@/components/auth/email-confirmation-redirect"
import { coreRoutes } from "@/lib/routes/core-routes"

type PageProps = {
  params: Promise<{
    token: string
  }>
}

export default async function EmailConfirmationPage({ params }: PageProps) {
  const { token } = await params

  let success = false
  let message: string | undefined
  let errorType: "invalid" | "server" = "invalid"

  try {
    const res = await fetch(coreRoutes.auth.emailConfirm, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    })

    const data = await res.json()

    success = data?.success === true
    message = typeof data?.message === "string" ? data.message : undefined

    if (!success && res.status >= 500) {
      errorType = "server"
    }
  } catch {
    errorType = "server"
  }

  return (
    <EmailConfirmationRedirect
      token={token}
      success={success}
      message={message}
      errorType={errorType}
    />
  )
}
