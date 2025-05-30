"use client";

import { useState } from "react";
import { Image } from "antd";
interface SimpleImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
}

export default function SimpleImage({
  src,
  alt,
  className = "",
  aspectRatio = "auto",
}: SimpleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "";
    }
  };

  // URL ni to'g'ri formatga o'tkazish
  const getImageUrl = (url: string) => {
    if (!url) return "";

    // Agar URL /uploads/ bilan boshlansa, API proxy orqali yuklash
    if (url.startsWith("/uploads/")) {
      return `/api/images${url.replace("/uploads/", "/")}`;
    }

    // Agar URL http bilan boshlansa, to'g'ridan-to'g'ri ishlatish
    if (url.startsWith("http")) {
      return url;
    }

    // Boshqa hollarda, API proxy orqali
    if (url.includes("uploads/")) {
      const path = url.split("uploads/")[1];
      return `/api/images/${path}`;
    }

    return url;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.log("Image failed to load:", src);
    setIsLoading(false);
    setImageError(true);
  };

  // Agar src yo'q yoki xatolik bo'lsa, bo'sh div ko'rsatamiz
  if (!src || imageError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${getAspectRatioClass()} ${className}`}
      >
        <div className="text-gray-400 text-center">
          <div className="text-xs">Rasm mavjud emas</div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(src);

  return (
    <div
      className={`relative overflow-hidden ${getAspectRatioClass()} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse text-gray-400 text-xs">
            Yuklanmoqda...
          </div>
        </div>
      )}

      <Image
        width={200}
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        width="100%"
        height="100%"
        className={`w-full !h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {/* <img
        src={imageUrl || "/placeholder.svg"}
        alt={alt}

      /> */}
    </div>
  );
}
