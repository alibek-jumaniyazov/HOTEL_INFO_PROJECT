"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Coffee, Tv, Bath, Car } from "lucide-react";

export default function RoomsSection() {
  const rooms = [
    {
      id: 1,
      name: "Standart xona",
      price: "150,000",
      image: "/placeholder.svg?height=300&width=400",
      capacity: "2 kishi",
      size: "25 m²",
      features: ["Bepul WiFi", "Konditsioner", "TV", "Mini bar"],
      amenities: [Wifi, Tv, Coffee, Bath],
      popular: false,
    },
    {
      id: 2,
      name: "Deluxe xona",
      price: "250,000",
      image: "/placeholder.svg?height=300&width=400",
      capacity: "3 kishi",
      size: "35 m²",
      features: ["Bepul WiFi", "Balkon", "Jacuzzi", "Room service"],
      amenities: [Wifi, Tv, Coffee, Bath],
      popular: true,
    },
    {
      id: 3,
      name: "Suite xona",
      price: "450,000",
      image: "/placeholder.svg?height=300&width=400",
      capacity: "4 kishi",
      size: "60 m²",
      features: [
        "VIP xizmat",
        "Alohida yashash xonasi",
        "Panorama ko'rinish",
        "Butler xizmati",
      ],
      amenities: [Wifi, Tv, Coffee, Bath, Car],
      popular: false,
    },
  ];

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bizning xonalar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har xil ehtiyojlar uchun mo'ljallangan zamonaviy va qulay xonalar.
            Barcha xonalarda yuqori sifatli jihozlar va professional xizmat.
          </p>
        </div>

        <div className="flex justify-between items-start gap-8">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 relative w-[30%]"
            >
              {room.popular && (
                <Badge className="absolute top-4 left-4 z-10 bg-blue-600 hover:bg-blue-700">
                  Mashhur
                </Badge>
              )}

              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {room.name}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity}</span>
                      </div>
                    </div>
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {room.price}
                    </div>
                    <div className="text-sm text-gray-500">so'm/kecha</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-start items-center gap-4 mb-4">
                  {room.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {/* 
                <div className="flex items-center space-x-3 mb-6">
                  {room.amenities.map((Icon, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                </div> */}
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Ma'lumot olish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Qo'shimcha ma'lumot
          </Button>
        </div>
      </div>
    </section>
  );
}
