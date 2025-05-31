"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Loader2 } from "lucide-react";

interface HotelData {
  id?: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  features: string[];
  image?: string;
  rating?: number;
  totalRooms?: number;
}

export default function HotelInfoForm() {
  const [hotelData, setHotelData] = useState<HotelData>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    features: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  // Load hotel data on component mount
  useEffect(() => {
    loadHotelData();
  }, []);

  const loadHotelData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hotel");
      const result = await response.json();

      if (result.success) {
        setHotelData(result.data);
        setFeaturesText(result.data.features.join(", "));
      } else {
        alert("Hotel ma'lumotlarini yuklashda xatolik: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Hotel ma'lumotlarini yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const featuresArray = featuresText
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const dataToSend = {
        ...hotelData,
        features: featuresArray,
      };

      const response = await fetch("/api/hotel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setHotelData(result.data);
        alert("Hotel ma'lumotlari muvaffaqiyatli saqlandi!");
      } else {
        alert("Xatolik: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Ma'lumotlarni saqlashda xatolik");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Hotel ma&rsquo;lumotlari yuklanmoqda...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotel Asosiy Ma&rsquo;lumotlari</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Nomi *
              </label>
              <Input
                value={hotelData.name}
                onChange={(e) =>
                  setHotelData({ ...hotelData, name: e.target.value })
                }
                placeholder="Hotel nomi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <Input
                value={hotelData.phone}
                onChange={(e) =>
                  setHotelData({ ...hotelData, phone: e.target.value })
                }
                placeholder="Telefon raqami"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={hotelData.email}
                onChange={(e) =>
                  setHotelData({ ...hotelData, email: e.target.value })
                }
                placeholder="Email manzili"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manzil *
              </label>
              <Input
                value={hotelData.address}
                onChange={(e) =>
                  setHotelData({ ...hotelData, address: e.target.value })
                }
                placeholder="Hotel manzili"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <Textarea
              value={hotelData.description}
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
              placeholder="Hotel haqida qisqacha ma'lumot"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xususiyatlar
            </label>
            <Textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Hotel xususiyatlari (vergul bilan ajrating)"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Masalan: Bepul WiFi, Parking, Restaurant, Fitnes zal
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Rasmi
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Rasm yuklash uchun bosing</p>
              <Button variant="outline" className="mt-2" type="button">
                Rasm tanlash
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={loadHotelData}>
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saqlash
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
