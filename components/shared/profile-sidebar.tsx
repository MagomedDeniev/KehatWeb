import Link from "next/link"
import { Lock, UserPen, MonitorSmartphone, CircleUser, Settings } from "lucide-react"

import { getCurrentUser } from "@/lib/core/auth"
import { viewRoutes } from "@/lib/routes/view-routes"
import {
  Button,
  Card,
} from "@/components/ui"

export async function ProfileSidebar() {
  const user = await getCurrentUser()

  if (user) {
    return (
      <aside className="hidden lg:block">
        <div className="kht-navbar-offset-top sticky">
          <Card className="p-3">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href={viewRoutes.user.profile(user.data.username)}>
                  <CircleUser className="h-4 w-4" /> Профиль
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href={viewRoutes.user.edit(user.data.username)}>
                  <UserPen className="h-4 w-4" /> Редактирование
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href={viewRoutes.user.devices(user.data.username)}>
                  <MonitorSmartphone className="h-4 w-4" /> Устройства
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href={viewRoutes.user.settings(user.data.username)}>
                  <Settings className="h-4 w-4" /> Настройки
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href={viewRoutes.user.password(user.data.username)}>
                  <Lock className="h-4 w-4" /> Пароль
                </Link>
              </Button>
            </nav>
          </Card>
        </div>
      </aside>
    )
  }
}
