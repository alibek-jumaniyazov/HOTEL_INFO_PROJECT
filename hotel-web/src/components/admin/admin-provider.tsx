"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthAPI } from "@/lib/api"

interface AdminContextType {
  isAuthenticated: boolean
  logout: () => void
  isLoading: boolean
  user: any
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is authenticated only on client side
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const authenticated = AuthAPI.isAuthenticated()
        const userData = AuthAPI.getUser()

        setIsAuthenticated(authenticated)
        setUser(userData)

        if (authenticated) {
          console.log("User authenticated:", userData)

          // Check token expiry and show warning if needed
          const expiryTime = AuthAPI.getTokenExpiryTime()
          if (expiryTime) {
            const timeUntilExpiry = expiryTime.getTime() - Date.now()
            console.log("Token expires in:", Math.round(timeUntilExpiry / 1000 / 60), "minutes")
          }
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    // Set up periodic token check (every 5 minutes)
    const tokenCheckInterval = setInterval(
      () => {
        if (typeof window !== "undefined") {
          const authenticated = AuthAPI.isAuthenticated()
          if (!authenticated && isAuthenticated) {
            console.log("Token expired, logging out...")
            setIsAuthenticated(false)
            setUser(null)
            window.location.href = "/admin/login"
          }
        }
      },
      5 * 60 * 1000,
    ) // Check every 5 minutes

    return () => clearInterval(tokenCheckInterval)
  }, [isAuthenticated])

  const logout = async () => {
    try {
      await AuthAPI.logout()
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if API call fails
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = "/admin/login"
    }
  }

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return <AdminContext.Provider value={{ isAuthenticated, logout, isLoading, user }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
