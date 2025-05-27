"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const telegramBotToken = "7636514543:AAG1S_m85XvBstXIKIAj27yrUwg5Upa0dBk";
    const chatId = "-4908989596";
    const message = `
🏨 Yangi xabar Hotel saytidan:

👤 Ism: ${formData.name}
📞 Telefon: ${formData.phone}
💬 Xabar: ${formData.message}
    `;

    try {
      await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        }
      );
      alert("Xabaringiz muvaffaqiyatli yuborildi!");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Manzil",
      content: "Toshkent, Amir Temur ko'chasi 15",
      subContent: "Chilonzor tumani",
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+998 90 123 45 67",
      subContent: "+998 71 123 45 67",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@luxuryhotel.uz",
      subContent: "booking@luxuryhotel.uz",
    },
    {
      icon: Clock,
      title: "Ish vaqti",
      content: "24/7 ochiq",
      subContent: "Har kuni xizmat",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Biz bilan bog'laning
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Savollaringiz bormi? Bron qilishda yordam kerakmi? Biz bilan
            bog'laning va professional maslahat oling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side - Map and contact info */}
          <div className="space-y-8">
            {/* Google Map */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.5!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location"
              ></iframe>
            </div>

            {/* Contact info cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 py-0"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          {info.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          {info.subContent}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Contact form */}
          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Ma'lumot so'rash
                </CardTitle>
                <p className="text-gray-600">
                  Xonalar, narxlar va xizmatlar haqida ma'lumot olish uchun
                  formani to'ldiring.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      Ismingiz *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ismingizni kiriting"
                      className="w-full p-5 pl-3 placeholder:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      Telefon raqami *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+998 90 123 45 67"
                      className="w-full p-5 pl-3 placeholder:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      Xabaringiz *
                    </label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Xabaringizni yozing..."
                      rows={5}
                      className="w-full h-[90px] pl-3 placeholder:text-base"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      "Yuborilmoqda..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Xabar yuborish
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Eslatma:</strong> Xabaringiz bo'yicha kun davomida
                    sizga aloqaga chiqamiz. Iltimos, telefon raqamingizni
                    to'g'ri kiriting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
