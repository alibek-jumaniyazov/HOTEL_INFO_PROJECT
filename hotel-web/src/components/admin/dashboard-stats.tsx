"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Bed, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsAPI } from "@/lib/api";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    occupancyRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await StatsAPI.getDashboardStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Statistikalarni yuklashda xatolik");
      }
    } catch (error) {
      console.error(error);

      setError("Serverga ulanishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = [
    {
      title: "Jami Xonalar",
      value: stats.totalRooms.toString(),
      change: "Umumiy xonalar soni",
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "Bo'sh Xonalar",
      value: stats.availableRooms.toString(),
      change: "Mavjud xonalar",
      icon: Bed,
      color: "text-green-600",
    },
    {
      title: "Band Xonalar",
      value: stats.occupiedRooms.toString(),
      change: "Egallangan xonalar",
      icon: Bed,
      color: "text-red-600",
    },
    {
      title: "Band bo'lish foizi",
      value: `${stats.occupancyRate}%`,
      change: "Xonalar egallash darajasi",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadStats} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Qayta urinish
        </Button>
      </div>
    );
  }

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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Real-time Statistika</h3>
        <Button onClick={loadStats} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Yangilash
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
