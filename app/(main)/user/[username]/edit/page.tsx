import { EditProfileForm } from "@/components/forms/account/edit-profile-form"
import { getCurrentUser } from "@/lib/core/auth"
import { redirect } from "next/navigation"

export default async function UserSettingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  return <EditProfileForm username={currentUser.data.username} />
}
