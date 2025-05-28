"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Calendar, Award } from "lucide-react"
import SimpleImage from "@/components/ui/simple-image"

export default function HotelInfo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToContact = () => {
    if (typeof window !== "undefined") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    "Toshkent markazida qulay joylashuv",
    "150 ta zamonaviy xona va suite",
    "24/7 xona xizmati",
    "Bepul WiFi barcha hududlarda",
    "Fitnes markaz va spa",
    "Biznes markaz va konferens zallari",
    "Restoran va bar",
    "Bepul parking",
  ]

  const stats = [
    { icon: Users, number: "10,000+", label: "Mamnun mijozlar" },
    { icon: Calendar, number: "15+", label: "Yillik tajriba" },
    { icon: Award, number: "25+", label: "Mukofotlar" },
  ]

  if (!mounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Bizning hotel haqida</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Luxury Hotel - Toshkent markazida joylashgan zamonaviy 5 yulduzli mehmonxona. Biz mijozlarimizga eng
                yuqori sifatli xizmat va unutilmas tajriba taqdim etamiz.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bizning professional jamoa har bir mehmonning ehtiyojlarini qondirish uchun 24/7 xizmat ko'rsatadi.
                Zamonaviy qulayliklar va an'anaviy mehmondo'stlik bizning asosiy tamoyillarimizdir.
              </p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={scrollToContact}>
              Aloqa uchun
            </Button>
          </div>

          {/* Right side - Hotel image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <SimpleImage src="/images/hotel-exterior.jpg" alt="Luxury Hotel" className="w-full h-[600px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating card */}
            <Card className="absolute -bottom-6 -left-6 bg-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">5 yulduzli</div>
                    <div className="text-sm text-gray-600">Sertifikatlangan hotel</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
