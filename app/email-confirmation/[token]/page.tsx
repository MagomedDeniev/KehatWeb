import { GalleryVerticalEndIcon } from "lucide-react"
import { EmailConfirmationRedirect } from "@/components/email-confirmation-redirect"

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
    const res = await fetch(`${process.env.API_URL}/confirm/email`, {
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
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Kehat Inc.
        </span>

        <EmailConfirmationRedirect
          token={token}
          success={success}
          message={message}
          errorType={errorType}
        />
      </div>
    </div>
  )
}
