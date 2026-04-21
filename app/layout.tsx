import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui"

import { NavbarServer } from "@/components/shared/navbar-server"
import { ThemeProvider } from "@/components/theme-provider"
import { Geist_Mono, Inter } from "next/font/google"
import React from "react"

import "./globals.css"
import "./layout.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
        <NavbarServer />
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <div className="kht-container flex max-w-7xl">
              { children }
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
