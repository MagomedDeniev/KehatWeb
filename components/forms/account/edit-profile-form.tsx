"use client"

import { cn } from "@/lib/utils"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  Separator,
} from "@/components/ui"
import React from "react"
import Link from "next/link"
import { viewRoutes } from "@/lib/routes/view-routes"

interface EditProfileFormProps {
  username: string
}

export function EditProfileForm({ username }: EditProfileFormProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Редактирование профиля</CardTitle>
          <CardDescription>
            Измените данные своего публичного профиля
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-3" />
          <div className="text-center text-muted-foreground">
            Здесь будет форма редактирования публичного профиля
          </div>
          <Separator className="mt-3 mb-4" />
          <form>
            <FieldGroup>
              <div className="flex items-center justify-between gap-3">
                <Button type="submit">Сохранить</Button>

                <Button variant="ghost" asChild className="w-auto">
                  <Link href={viewRoutes.user.profile(username)}>Отмена</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
