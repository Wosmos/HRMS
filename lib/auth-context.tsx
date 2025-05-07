"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, users } from "./data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("hrms_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo credentials logic
        const demoUsers = [
          { email: "demo.admin@demo.com", password: "demo1234" },
          { email: "demo.manager@demo.com", password: "demo1234" },
          { email: "demo.employee@demo.com", password: "demo1234" },
          { email: "demo.finance@demo.com", password: "demo1234" },
          { email: "demo.superadmin@demo.com", password: "demo1234" },
        ]
        const demoUser = demoUsers.find((u) => u.email === email && password === u.password)
        if (demoUser) {
          const foundUser = users.find((u) => u.email === email)
          if (foundUser) {
            setUser(foundUser)
            localStorage.setItem("hrms_user", JSON.stringify(foundUser))
            resolve(true)
            return
          }
        }
        // Normal user logic
        const foundUser = users.find((u) => u.email === email)
        if (foundUser) {
          setUser(foundUser)
          localStorage.setItem("hrms_user", JSON.stringify(foundUser))
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hrms_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
