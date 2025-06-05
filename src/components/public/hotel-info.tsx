"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar } from "lucide-react";
import hotelImg from "@@/public/hotel.jpg";
import Image from "next/image";

export default function HotelInfo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToContact = () => {
    if (typeof window !== "undefined") {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    "Xorazm markazida qulay joylashuv",
    "11 ta zamonaviy xona",
    "24/7 xona xizmati",
    "Bepul WiFi barcha hududlarda",
    "Bepul parking",
  ];

  const stats = [
    { icon: Users, number: "300+", label: "Mamnun mijozlar" },
    { icon: Calendar, number: "1+", label: "Yillik tajriba" },
  ];

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
    );
  }

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bizning hotel haqida 
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Sulaymon hotel - Urganch shaxrida joylashgan. Zamonaviy
                qulayliklar va professional xizmat.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bizning professional jamoa har bir mehmonning ehtiyojlarini
                qondirish uchun 24/7 xizmat ko&rsquo;rsatadi. Zamonaviy
                qulayliklar va an&rsquo;anaviy mehmondo&rsquo;stlik bizning
                asosiy tamoyillarimizdir.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={scrollToContact}
            >
              Aloqa uchun
            </Button>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* <img src={hotelImg} alt="" /> */}
              <Image
                src={hotelImg}
                alt="Luxury Hotel"
                className="w-full  object-cover"
              />
              {/* <SimpleImage
                src={hotelImg}
                alt="Luxury Hotel"
                className="w-full h-[600px]"
              /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
