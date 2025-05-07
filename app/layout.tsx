import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Layout } from "@/components/layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NEXTSOFT HRMS",
  description: "Human Resource Management System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="hrms-ui-theme">
          <AuthProvider> <Layout>{children}</Layout></AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
