import type React from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  backLink?: {
    href: string
    label: string
  }
  alternativeAction?: {
    label: string
    href: string
    text: string
  }
}

export function AuthLayout({ children, title, subtitle, backLink, alternativeAction }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Image and branding */}
      <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary/60 p-6 text-primary-foreground md:w-1/2">
        <div className="absolute right-4 top-4 md:hidden">
          <ThemeToggle />
        </div>
        {backLink && (
          <div className="absolute left-4 top-4">
            <Link
              href={backLink.href}
              className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              {backLink.label}
            </Link>
          </div>
        )}
        <div className="mb-8 flex items-center">
          <div className="mr-2 rounded-md bg-primary-foreground p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-2xl font-bold">Avialdo HRMS</span>
        </div>
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Empowering Teams, Streamlining HR</h2>
          <p className="text-primary-foreground/80">
            A comprehensive human resource management system designed to enhance productivity and simplify workforce
            management.
          </p>
        </div>
        <div className="mt-12 flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-primary-foreground/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary-foreground/30"></div>
          <div className="h-2 w-8 rounded-full bg-primary-foreground"></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center bg-background p-6 md:w-1/2">
        <div className="absolute right-4 top-4 hidden md:block">
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {alternativeAction && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{alternativeAction.text}</span>{" "}
              <Link href={alternativeAction.href} className="font-medium text-primary hover:underline">
                {alternativeAction.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
