"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ImageIcon } from "lucide-react";
import ImageCarousel from "@/components/ui/image-carousel";
import { CategoriesAPI, Category, RoomsAPI, type Room } from "@/lib/api";

export default function RoomsSection() {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roomsNumber, setRoomsNumber] = useState(3);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadInitialData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [roomRes, categoryRes] = await Promise.all([
        RoomsAPI.getAllRooms(),
        CategoriesAPI.getAllCategories(),
      ]);

      if (roomRes.success && roomRes.data) {
        setAllRooms(roomRes.data);
      } else {
        setError("Xonalarni yuklashda xatolik");
      }

      if (categoryRes.success && categoryRes.data) {
        setCategories(categoryRes.data);
      } else {
        setError("Kategoriyalarni yuklashda xatolik");
      }
    } catch (err) {
      console.log(err);
      setError("Serverga ulanishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const scrollToContact = () => {
    document?.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredRooms =
    selectedCategory === "all"
      ? allRooms
      : allRooms.filter((room) => room.category?.name === selectedCategory);

  if (error) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bizning xonalar
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Har xil ehtiyojlar uchun qulay xonalar.
          </p>
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={loadInitialData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Qayta urinish
          </Button>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Bizning xonalar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Xonalar yuklanmoqda...
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
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bizning xonalar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har xil ehtiyojlar uchun zamonaviy va qulay xonalar.
          </p>
        </div>

        <div className="!w-full flex max-sm:flex-wrap max-sm:justify-center  justify-between mb-10 gap-4">
          <p
            // variant="outline"
            onClick={() => setSelectedCategory("all")}
            className={
              selectedCategory === "all"
                ? "border-b-2 border-blue-500 transition-colors max-sm:!w-auto !w-full text-center cursor-pointer pb-2.5"
                : "max-sm:!w-auto !w-full text-center cursor-pointer border-b-2 border-blue-200 pb-2.5 hover:border-blue-500 transition-colors"
            }
          >
            Barchasi
          </p>
          {categories.map((category) => (
            <p
              key={category.id}
              // variant="outline"
              onClick={() => setSelectedCategory(category.name)}
              className={
                selectedCategory === category.name
                  ? "border-b-2 border-blue-500 transition-colors max-sm:!w-auto !w-full text-center cursor-pointer pb-2.5"
                  : "max-sm:!w-auto !w-full text-center cursor-pointer border-b-2 border-blue-200 pb-2.5 hover:border-blue-500 transition-colors"
              }
            >
              {category.name}
            </p>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.slice(0, roomsNumber).map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden hover:shadow-xl transition p-0"
            >
              {room.category?.name && (
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white shadow-md">
                  {room.category.name}
                </Badge>
              )}

              <CardHeader className="p-0">
                <ImageCarousel
                  images={room.images || []}
                  alt={room.title}
                  aspectRatio="video"
                  className="group-hover:scale-105 transition-transform duration-300"
                  autoPlay
                  autoPlayInterval={4000}
                />
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {room.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {room.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      so&rsquo;m/kecha
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Qulayliklar:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((a, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {a}
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
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={scrollToContact}
                >
                  Ma&rsquo;lumot olish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bu kategoriya bo‘yicha xonalar yo‘q
            </h3>
            <p className="text-gray-500">Boshqa kategoriyani tanlang</p>
          </div>
        )}

        {filteredRooms.length > roomsNumber && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => setRoomsNumber((prev) => prev + 3)}
            >
              Yana ko‘rsatish
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
