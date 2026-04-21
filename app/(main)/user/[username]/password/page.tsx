import { notFound, redirect } from "next/navigation"
import { ChangePasswordForm } from "@/components/forms/account/change-password-form"
import { getCurrentUser } from "@/lib/auth"

type PageProps = {
  params: Promise<{
    username: string
  }>
}

export default async function UserPasswordPage({ params }: PageProps) {
  const { username } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  if (currentUser.data.username !== username) {
    notFound()
  }

  return (
      <ChangePasswordForm username={currentUser.data.username} />
  )
}
