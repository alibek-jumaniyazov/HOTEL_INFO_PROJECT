import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  // Facebook,
  // Instagram,
  // Twitter,
  // Youtube,
} from "lucide-react";
import Image from "next/image";
import Logo from "/public/Logo.svg";

export default function Footer() {
  const quickLinks = [
    { name: "Bosh sahifa", href: "#home" },
    { name: "Hotel haqida", href: "#about" },
    { name: "Xonalar", href: "#rooms" },
    { name: "Xizmatlar", href: "#services" },
    { name: "Aloqa", href: "#contact" },
  ];

  // const services = [
  //   "Xona xizmati",
  //   "Spa va wellness",
  //   "Fitnes markaz",
  //   "Biznes markaz",
  //   "Konferens zallari",
  //   "Restaurant",
  //   "Bar va lounge",
  //   "Concierge xizmati",
  // ];

  // const socialLinks = [
  //   { icon: Facebook, href: "#", name: "Facebook" },
  //   { icon: Instagram, href: "#", name: "Instagram" },
  //   { icon: Twitter, href: "#", name: "Twitter" },
  //   { icon: Youtube, href: "#", name: "YouTube" },
  // ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Maxsus takliflardan xabardor bo&rsquo;ling
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Yangi takliflar, chegirmalar va hotel yangiliklari haqida birinchi
              bo&rsquo;lib bilib oling
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email manzilingiz"
                className="flex-1 bg-white text-gray-900"
              />
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Obuna bo&rsquo;lish
              </Button>
            </div>
          </div>
        </div>
      </div> */}

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

              {/* Social links */}
              {/* <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div> */}
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

            {/* <div>
              <h4 className="text-lg font-semibold mb-6">Xizmatlar</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="text-gray-300">
                    {service}
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Contact info */}
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

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">info@luxuryhotel.uz</p>
                    <p className="text-sm text-gray-400">
                      booking@luxuryhotel.uz
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency contact */}
              <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-800">
                <h5 className="font-semibold text-red-400 mb-2">
                  Favqulodda holat
                </h5>
                <p className="text-red-300 text-sm">+998 71 123 45 67</p>
              </div>
            </div>

            <div className="">
              <h4 className="text-lg font-semibold mb-6">Sayt Yaratuvchilar</h4>
              {/* <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="text-gray-300">
                    {service}
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Luxury Hotel. Barcha huquqlar himoyalangan.
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
