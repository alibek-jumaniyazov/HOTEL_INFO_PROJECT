"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search, Settings, LogOut, User, Home } from "lucide-react"
import { useAdmin } from "./admin-provider"
import Link from "next/link"

export default function AdminHeader() {
  const { logout } = useAdmin()

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
          <Link href="/" target="_blank">
            <Button variant="ghost" size="icon" title="Saytni ko'rish">
              <Home className="w-5 h-5" />
            </Button>
          </Link>

   
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Chiqish">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
