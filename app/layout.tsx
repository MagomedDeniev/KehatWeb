import { Geist_Mono, Inter } from "next/font/google"
import { NavbarServer } from "@/components/navbar/navbar-server"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import React from "react"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <Toaster />

        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <NavbarServer />
            <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
