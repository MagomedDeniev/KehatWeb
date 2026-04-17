"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/shared/logout-button"
import type { CurrentUser } from "@/lib/auth"

type NavbarProps = {
  user: CurrentUser | null
}

const links = [
  { href: "/about", label: "О нас" },
  { href: "/projects", label: "Проекты" },
]

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/public" className="text-lg font-semibold tracking-tight">
          кехат
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <Button asChild>
              <Link href="/login">Войти</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{user.data.username}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link href={`/u/${user.data.username}`}>Профиль</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/u/${user.data.username}/settings`}>
                      Настройки
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/u/${user.data.username}/password`}>
                      Пароль
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <LogoutButton />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Открыть меню"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Войти
                </Link>
              </Button>

              <Button asChild>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Начать
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" asChild>
                <Link
                  href={`/u/${user.data.username}`}
                  onClick={() => setOpen(false)}
                >
                  Профиль
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link
                  href={`/u/${user.data.username}/settings`}
                  onClick={() => setOpen(false)}
                >
                  Настройки
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link
                  href={`/u/${user.data.username}/password`}
                  onClick={() => setOpen(false)}
                >
                  Пароль
                </Link>
              </Button>

              <LogoutButton variant="button" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
