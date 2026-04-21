import { RestorePasswordForm } from "@/components/forms/auth/restore-password-form"

type PageProps = {
  params: Promise<{
    token: string
  }>
}

export default async function RestorePasswordPage({ params }: PageProps) {
  const { token } = await params

  return <RestorePasswordForm token={token} />
}
