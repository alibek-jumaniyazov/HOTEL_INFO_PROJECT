"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, LogOut, User, Home, Clock, RefreshCw } from "lucide-react"
import { useAdmin } from "./admin-provider"
import { AuthAPI } from "@/lib/api"
import Link from "next/link"

export default function AdminHeader() {
  const { logout, user } = useAdmin()
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>("")

  useEffect(() => {
    // Get initial token expiry
    const expiry = AuthAPI.getTokenExpiryTime()
    setTokenExpiry(expiry)

    // Update countdown every minute
    const interval = setInterval(() => {
      const expiry = AuthAPI.getTokenExpiryTime()
      setTokenExpiry(expiry)

      if (expiry) {
        const now = new Date()
        const diff = expiry.getTime() - now.getTime()

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeUntilExpiry(`${hours}:${minutes.toString().padStart(2, "0")}`)
        } else {
          setTimeUntilExpiry("Expired")
        }
      }
    }, 60000) // Update every minute

    // Initial calculation
    if (expiry) {
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilExpiry(`${hours}:${minutes.toString().padStart(2, "0")}`)
      } else {
        setTimeUntilExpiry("Expired")
      }
    }

    return () => clearInterval(interval)
  }, [])

  const handleRefreshToken = async () => {
    try {
      const success = await AuthAPI.refreshToken()
      if (success) {
        alert("Token muvaffaqiyatli yangilandi!")
        // Update expiry time
        const newExpiry = AuthAPI.getTokenExpiryTime()
        setTokenExpiry(newExpiry)
      } else {
        alert("Token yangilashda xatolik!")
      }
    } catch (error) {
      alert("Token yangilashda xatolik!")
    }
  }

  const getTokenStatus = () => {
    if (!tokenExpiry) return { color: "gray", text: "Unknown" }

    const now = new Date()
    const diff = tokenExpiry.getTime() - now.getTime()

    if (diff <= 0) {
      return { color: "red", text: "Expired" }
    } else if (diff < 5 * 60 * 1000) {
      // Less than 5 minutes
      return { color: "red", text: "Expiring Soon" }
    } else if (diff < 30 * 60 * 1000) {
      // Less than 30 minutes
      return { color: "yellow", text: "Expiring" }
    } else {
      return { color: "green", text: "Active" }
    }
  }

  const tokenStatus = getTokenStatus()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Token Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Token:</span>
            <Badge
              variant={
                tokenStatus.color === "green" ? "default" : tokenStatus.color === "yellow" ? "secondary" : "destructive"
              }
              className="text-xs"
            >
              {timeUntilExpiry || tokenStatus.text}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshToken}
              className="h-6 px-2 text-xs"
              title="Token yangilash"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>

          {/* Public site link */}
          <Link href="/" target="_blank">
            <Button variant="ghost" size="icon" title="Saytni ko'rish">
              <Home className="w-5 h-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Chiqish">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Token expiry warning */}
      {tokenStatus.color === "red" && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">
                {timeUntilExpiry === "Expired" ? "Token muddati tugagan!" : "Token muddati tugamoqda!"}
              </span>
            </div>
            <Button size="sm" onClick={handleRefreshToken} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-3 h-3 mr-1" />
              Yangilash
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
