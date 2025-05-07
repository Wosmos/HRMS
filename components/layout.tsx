"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  Clock,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  UserCircle,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { hasPermission } from "@/lib/data"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (!user) {
    return <>{children}</>
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: Clock,
      current: pathname === "/attendance",
      show: hasPermission(user.role, "attendance", "read"),
    },
    {
      name: "Leaves",
      href: "/leaves",
      icon: Calendar,
      current: pathname === "/leaves",
      show: hasPermission(user.role, "leaves", "read"),
    },
    {
      name: "Shifts",
      href: "/shifts",
      icon: ClipboardCheck,
      current: pathname === "/shifts",
      show: hasPermission(user.role, "shifts", "read"),
    },
    {
      name: "Payroll",
      href: "/payroll",
      icon: CreditCard,
      current: pathname === "/payroll",
      show: hasPermission(user.role, "payroll", "read"),
    },
    {
      name: "Employees",
      href: "/employees",
      icon: Users,
      current: pathname === "/employees",
      show: hasPermission(user.role, "users", "read"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      current: pathname === "/reports",
      show: ["super_admin", "admin", "finance"].includes(user.role),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
      show: ["super_admin", "admin"].includes(user.role),
    },
  ].filter((item) => item.show !== false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <div
        className={` fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <UserCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NEXTSOFT HRMS</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-card transition duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <UserCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NEXTSOFT HRMS</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="mr-2 md:hidden">
              <Menu className="h-5 w-5 " />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:inline-flex md:hidden"
            >
              <Menu className="h-5 w-5 " />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}
