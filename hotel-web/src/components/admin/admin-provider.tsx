"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminContextType {
  isAuthenticated: boolean
  logout: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated only on client side
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = document.cookie.includes("admin-token=authenticated")
        setIsAuthenticated(token)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const logout = () => {
    if (typeof window !== "undefined") {
      document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      setIsAuthenticated(false)
      window.location.href = "/admin/login"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <AdminContext.Provider value={{ isAuthenticated, logout, isLoading }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
