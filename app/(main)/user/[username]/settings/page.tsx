import { notFound, redirect } from "next/navigation"
import { ChangeSettingsForm } from "@/components/forms/account/change-settings-form"
import { getCurrentUser } from "@/lib/core/auth"

type PageProps = {
  params: Promise<{
    username: string
  }>
}

export default async function UserSettingsPage({ params }: PageProps) {
  const { username } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  if (currentUser.data.username !== username) {
    notFound()
  }

  return (
    <ChangeSettingsForm
      initialValues={{
        email: currentUser.data.email,
        username: currentUser.data.username,
        gender: currentUser.data.gender,
        birthDate: currentUser.data.birthDate,
      }}
    />
  )
}
