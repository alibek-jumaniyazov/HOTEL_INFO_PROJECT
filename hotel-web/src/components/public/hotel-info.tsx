"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Calendar, Award } from "lucide-react"

export default function HotelInfo() {
  const features = [
    "Toshkent markazida qulay joylashuv",
    "5 ta zamonaviy xona va suite",
    "24/7 xona xizmati",
    "Bepul WiFi barcha hududlarda",
    "Bepul parking",
  ]

  const stats = [
    { icon: Users, number: "500+", label: "Mamnun mijozlar" },
    { icon: Calendar, number: "2+", label: "Yillik tajriba" },
    // { icon: Award, number: "25+", label: "Mukofotlar" },
  ]

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
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Aloqa uchun
            </Button>
          </div>

          {/* Right side - Hotel image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Luxury Hotel"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  )
}
