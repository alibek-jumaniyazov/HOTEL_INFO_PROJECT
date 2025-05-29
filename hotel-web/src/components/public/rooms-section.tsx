"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ImageIcon } from "lucide-react"
import ImageCarousel from "@/components/ui/image-carousel"
import { RoomsAPI, type Room } from "@/lib/api"

export default function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await RoomsAPI.getAllRooms()

      if (response.success && response.data) {
        setRooms(response.data.slice(0, 6))
      } else {
        setError(response.error || "Xonalarni yuklashda xatolik")
      }
    } catch (error) {
      setError("Serverga ulanishda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToContact = () => {
    if (typeof window !== "undefined") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (error) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Bizning xonalar</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Har xil ehtiyojlar uchun mo'ljallangan zamonaviy va qulay xonalar.
            </p>
          </div>
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={loadRooms} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Qayta urinish
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Bizning xonalar</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Har xil ehtiyojlar uchun mo'ljallangan zamonaviy va qulay xonalar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Xonalar yuklanmoqda...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Bizning xonalar</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har xil ehtiyojlar uchun mo'ljallangan zamonaviy va qulay xonalar. Barcha xonalarda yuqori sifatli jihozlar
            va professional xizmat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            return (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group py-0"
              >
                {room.category?.name && (
                  <Badge className="absolute top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 shadow-lg ">
                    {room.category.name}
                  </Badge>
                )}

                <CardHeader className="p-0">
                  <div className="relative overflow-hidden">
                    <ImageCarousel
                      images={room.images || []}
                      alt={room.title}
                      aspectRatio="video"
                      className="group-hover:scale-105 transition-transform duration-300 z-40 "
                      autoPlay={true}
                      autoPlayInterval={4000}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{room.title}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{room.price}</div>
                      <div className="text-sm text-gray-500">so'm/kecha</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Qulayliklar:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={scrollToContact}>
                    Ma'lumot olish
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha xonalar mavjud emas</h3>
            <p className="text-gray-500">Tez orada yangi xonalar qo'shiladi</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={scrollToContact}
          >
            Barcha xonalarni ko'rish
          </Button>
        </div>
      </div>
    </section>
  )
}
