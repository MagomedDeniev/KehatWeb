import React from "react"

import { Sidebar } from "@/components/shared/sidebar"
import { ProfileSidebar } from "@/components/shared/profile-sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="kht-gap grid w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[240px_minmax(0,1fr)_240px]">
      <Sidebar />
      <main className="min-w-0">{children}</main>
      <ProfileSidebar/>
    </div>
  )
}
