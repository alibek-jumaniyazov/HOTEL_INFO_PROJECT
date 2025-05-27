"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Bed, TrendingUp, Loader2 } from "lucide-react"

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [hotelResponse, roomsResponse] = await Promise.all([fetch("/api/hotel"), fetch("/api/rooms")])

      const hotelResult = await hotelResponse.json()
      const roomsResult = await roomsResponse.json()

      if (hotelResult.success && roomsResult.success) {
        const rooms = roomsResult.data
        const availableRooms = rooms.filter((room: any) => room.status === "available").length
        const occupiedRooms = rooms.filter((room: any) => room.status === "occupied").length
        const totalRooms = rooms.length
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

        setStats({
          totalRooms,
          availableRooms,
          occupiedRooms,
          occupancyRate,
        })
      }
    } catch (error) {
      console.error("Statistikalarni yuklashda xatolik:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    {
      title: "Jami Xonalar",
      value: stats.totalRooms.toString(),
      change: "Umumiy xonalar soni",
      icon: Building,
    },
    {
      title: "Bo'sh Xonalar",
      value: stats.availableRooms.toString(),
      change: "Mavjud xonalar",
      icon: Bed,
    },
    {
      title: "Band Xonalar",
      value: stats.occupiedRooms.toString(),
      change: "Egallangan xonalar",
      icon: Bed,
    },
    // {
    //   title: "Band bo'lish foizi",
    //   value: `${stats.occupancyRate}%`,
    //   change: "Xonalar egallash darajasi",
    //   icon: TrendingUp,
    // },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
