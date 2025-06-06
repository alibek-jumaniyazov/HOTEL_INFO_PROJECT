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
      console.error(error);
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Manzil",
      content: "Urganch, Yoshlik ko'chasi 37/1",
      subContent: "Xorazm",
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+998 90 438 94 84",
      subContent: "+998 91 985 94 84",
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
            Biz bilan bog&lsquo;laning
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Savollaringiz bormi? Bron qilishda yordam kerakmi? Biz bilan
            bog&lsquo;laning va professional maslahat oling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side - Map and contact info */}
          <div className="space-y-8">
            {/* Google Map */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d373.3093950912438!2d60.622916590052256!3d41.53730803184438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sUrganch%20%2C%20yoshlik%20ko&#39;chasi%2037%2F1!5e0!3m2!1sru!2s!4v1748937315627!5m2!1sru!2s"
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

          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Ma&rsquo;lumot so&rsquo;rash
                </CardTitle>
                <p className="text-gray-600">
                  Xonalar, narxlar va xizmatlar haqida ma&rsquo;lumot olish
                  uchun formani to&rsquo;ldiring.
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
                      className="w-full p-8 pl-6 placeholder:text-base"
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
                      className="w-full p-8 pl-6 placeholder:text-base"
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
                      className="w-full h-[115px] pt-4 pl-6 placeholder:text-base"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold p-8 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Yuborilmoqda..."
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-2 " />
                        <span className="text-[20px]">Xabar yuborish</span>
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Eslatma:</strong> Xabaringiz bo&rsquo;yicha kun
                    davomida sizga aloqaga chiqamiz. Iltimos, telefon
                    raqamingizni to&rsquo;g&lsquo;ri kiriting.
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
