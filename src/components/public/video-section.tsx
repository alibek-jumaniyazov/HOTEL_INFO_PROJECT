"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import Image from "next/image";
import poster from "@@/public/image.png";
import { motion } from "motion/react";
import { AuroraBackground } from "../ui/auroroBg";
export default function VideoSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        id="video"
        className="py-20 bg-gradient-to-br  relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0">
            <div
              className="w-full h-full opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
              }}
            ></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bizning hotelni ko&rsquo;ring
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={poster}
                  alt="Hotel Video"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsVideoOpen(true)}
                    className="cursor-pointer w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
        {isVideoOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-12 right-0 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
              <div className="relative overflow-hidden rounded-lg">
                <video
                  src="/video/timelaps.mp4"
                  className="w-full h-auto"
                  controls
                  autoPlay
                >
                  <source src="/video/timelaps.mp4" type="video/mp4" />
                  Sizning brauzeringiz video formatini
                  qo&rsquo;llab-quvvatlamaydi.
                </video>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AuroraBackground>
  );
}
