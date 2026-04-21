import React from "react"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className="w-full">
        <div className="flex min-h-full w-full items-center justify-center pt-6">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <span className="flex items-center gap-2 self-center font-medium">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              Kehat Inc.
            </span>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
