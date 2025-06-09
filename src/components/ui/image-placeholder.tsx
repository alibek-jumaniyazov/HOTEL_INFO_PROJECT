import { useState } from "react";
import { ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImagePlaceholderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
}

export default function ImagePlaceholder({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  aspectRatio = "auto",
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create inline SVG placeholder
  const createPlaceholderSVG = (w: number, h: number) => {
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <g transform="translate(${w / 2}, ${h / 2})">
          <circle r="24" fill="#d1d5db"/>
          <path d="M-12,-8 L12,-8 L12,8 L-12,8 Z M-8,-4 L8,-4 L8,4 L-8,4 Z" fill="#9ca3af"/>
          <circle cx="-4" cy="-1" r="2" fill="#6b7280"/>
          <path d="M-8,2 L-4,-2 L0,2 L4,-1 L8,3" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
        </g>
        <text x="50%" y="75%" textAnchor="middle" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="14">
          ${w} × ${h}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

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

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  if (!src || imageError) {
    const placeholderSrc = createPlaceholderSVG(width, height);
    return (
      <div
        className={`relative overflow-hidden ${getAspectRatioClass()} ${className}`}
      >
        <Image
          src={placeholderSrc}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${getAspectRatioClass()} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Rasm yuklanmadi</p>
          </div>
        </div>
      )}
    </div>
  );
}
