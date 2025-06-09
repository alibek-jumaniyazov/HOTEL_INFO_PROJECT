import { Separator } from "@/components/ui/separator";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Logo from "/public/Logo.svg";
import Mbos from "/public/mbos.png";

export default function Footer() {
  const quickLinks = [
    { name: "Bosh sahifa", href: "#home" },
    { name: "Hotel haqida", href: "#about" },
    { name: "Xonalar", href: "#rooms" },
    { name: "Xizmatlar", href: "#services" },
    { name: "Aloqa", href: "#contact" },
  ];
  return (
    <footer className="bg-gray-900 text-white">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Image src={Logo} alt="Hotel Logo" className="w-12" />
                <span className="text-xl font-bold">Sulaymon Hotel</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Urganch shaxrida joylashgan. Zamonaviy qulayliklar va
                professional xizmat bilan unutilmas tajriba yaratamiz.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Tezkor havolalar</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">
                Aloqa ma&rsquo;lumotlari
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
                      Urganch, Yoshlik ko&lsquo;chasi 37/1
                    </p>
                    <p className="text-sm text-gray-400">Xorazm</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">+998 90 123 45 67</p>
                    <p className="text-sm text-gray-400">
                      24/7 qo&rsquo;llab-quvvatlash
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <h4 className="text-lg font-semibold mb-6">Sayt Yaratuvchilar</h4>
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <Image src={Mbos} alt="Mbos" className="!w-[150px]" />
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Sayt <a href="https://nodejs.org/en">Node.js</a> va{" "}
                  <a href="https://nextjs.org/">Next.js</a> yordamida
                  yaratilgan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-gray-800" />
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Sulaymon Hotel. Barcha huquqlar himoyalangan.
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400"></div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Foydalanish shartlari
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
