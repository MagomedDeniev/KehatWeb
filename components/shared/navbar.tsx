"use client"

import { cn } from "@/lib/utils"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui"

import { LogoutButton } from "@/components/auth/logout-button"
import type { CurrentUser } from "@/lib/core/auth"
import { Menu, GalleryVerticalEndIcon, X } from "lucide-react"
import React, { useState } from "react"
import Link from "next/link"

import { viewRoutes } from "@/lib/routes/view-routes"

type NavbarProps = {
  user: CurrentUser | null
}

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="kht-navbar fixed top-0 z-50 min-w-full border-b bg-background/60 text-foreground backdrop-blur">
      <div className="kht-navbar-container mx-auto flex max-w-6xl items-center justify-between px-4">
        <Link
          href={viewRoutes.home}
          className="text-lg font-semibold tracking-tight"
        >
          <span className="flex items-center gap-2 self-center font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <b>кехат.</b>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Button asChild>
                <Link href={viewRoutes.auth.login}>Войти</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={viewRoutes.auth.register}>Регистрация</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{user.data.username}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link href={viewRoutes.user.profile(user.data.username)}>
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <LogoutButton />
                  <LogoutButton scope="all" />
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
          {!user ? (
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link
                  href={viewRoutes.auth.login}
                  onClick={() => setOpen(false)}
                >
                  Войти
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link
                  href={viewRoutes.auth.register}
                  onClick={() => setOpen(false)}
                >
                  Регистрация
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" asChild>
                <Link
                  href={viewRoutes.user.profile(user.data.username)}
                  onClick={() => setOpen(false)}
                >
                  Профиль
                </Link>
              </Button>

              <LogoutButton variant="button" />
              <LogoutButton variant="button" scope="all" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
