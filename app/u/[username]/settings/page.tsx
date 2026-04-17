import { notFound, redirect } from "next/navigation"
import { SettingsForm } from "@/components/forms/settings-form"
import { getCurrentUser } from "@/lib/auth"

type PageProps = {
  params: Promise<{
    username: string
  }>
}

export default async function UserSettingsPage({ params }: PageProps) {
  const { username } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  if (currentUser.data.username !== username) {
    notFound()
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
      <SettingsForm
        initialValues={{
          email: currentUser.data.email,
          username: currentUser.data.username,
          gender: currentUser.data.gender,
          birthDate: currentUser.data.birthDate,
        }}
      />
    </div>
    </div>
  )
}
