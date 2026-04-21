import { Card, CardContent, Separator, Button } from "@/components/ui"
import { notFound } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { ContactIcon } from "lucide-react"
import { LucideCog } from "lucide-react"
import { viewRoutes } from "@/lib/routes"
import Link from "next/link"

type PageProps = {
  params: Promise<{
    username: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { username } = await params
  const user = await getUserProfile(username)

  if (!user) {
    notFound()
  }

  const profile = user.data
  const avatarLetter = profile.username.charAt(0).toUpperCase()

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-semibold">
            {avatarLetter}
          </div>

          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl leading-none font-semibold">
              {profile.username}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground">
              Зарегистрирован: {profile.registeredAt}
            </p>
            <p className="text-sm text-muted-foreground">
              <Button variant="secondary" size="sm">
                <ContactIcon /> Редактировать
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href={viewRoutes.user.settings(profile.username)}>
                  <LucideCog />
                </Link>
              </Button>
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="Имя пользователя" value={profile.username} />
          <InfoRow label="Дата регистрации" value={profile.registeredAt} />
        </div>
      </CardContent>
    </Card>
  )

  function InfoRow({ label, value }: { label: string; value: string }) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    )
  }
}
