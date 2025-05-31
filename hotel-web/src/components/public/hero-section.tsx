"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Car, Coffee, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Swagger Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="swagger"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.3" />
                <path
                  d="M0,10 Q5,0 10,10 T20,10"
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#swagger)" />
          </svg>
        </div>

        {/* Animated shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* <div className="flex items-center justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-lg font-medium">
              5.0 (1,234 ta sharh)
            </span>
          </div> */}

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Luxury Hotel
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Toshkent markazida joylashgan 5 yulduzli mehmonxona. Zamonaviy
            qulayliklar va professional xizmat.
          </p>

          <div className="flex items-center justify-center space-x-2 mb-8 text-blue-200">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">
              Toshkent, Amir Temur ko&rsquo;chasi 15
            </span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Wifi className="w-6 h-6 text-blue-300" />
              <span className="text-sm font-medium">Bepul WiFi</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Car className="w-6 h-6 text-blue-300" />
              <span className="text-sm font-medium">Parking</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Coffee className="w-6 h-6 text-blue-300" />
              <span className="text-sm font-medium">Restaurant</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            <Button
              size="lg"
              className="w-[300px] cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-15 py-10 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex gap-4"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Phone className="w-5 h-5" />
              Biz bilan bog&rsquo;laning
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
