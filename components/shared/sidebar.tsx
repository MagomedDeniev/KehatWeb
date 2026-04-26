import Link from "next/link"
import { MessageCircle, Rows3, Search, Bell } from "lucide-react"

import { getCurrentUser } from "@/lib/core/auth"
import { viewRoutes } from "@/lib/routes/view-routes"
import {
  Button,
  Card,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui"

export async function Sidebar() {
  const user = await getCurrentUser()

  return (
    <aside className="hidden lg:block">
      <div className="kht-navbar-offset-top sticky">
        {user ? (
          <Card className="kht-mb p-0">
            <Link
              className="flex items-center p-3 hover:bg-foreground/3"
              href={viewRoutes.user.profile(user.data.username)}
            >
              <Avatar className="mr-3" size="lg">
                <AvatarImage src="/#" alt="@shadcn" />
                <AvatarFallback>KH</AvatarFallback>
              </Avatar>
              <b>{user.data.username}</b>
            </Link>
          </Card>
        ) : null}

        <Card className="p-3">
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={viewRoutes.home}>
                <Rows3 className="h-4 w-4" /> Лента
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={viewRoutes.home}>
                <Search className="h-4 w-4" /> Рекомендации
              </Link>
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href={viewRoutes.home}>
                    <MessageCircle className="h-4 w-4" /> Сообщения
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href={viewRoutes.home}>
                    <Bell className="h-4 w-4" /> Уведомлении
                  </Link>
                </Button>
              </>
            ) : null}
          </nav>
        </Card>
      </div>
    </aside>
  )
}
