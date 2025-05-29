"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleImage from "./simple-image"

interface ImageCarouselProps {
  images: Array<{ id: number; url: string }>
  alt: string
  className?: string
  aspectRatio?: "square" | "video" | "auto"
  showDots?: boolean
  showArrows?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function ImageCarousel({
  images,
  alt,
  className = "",
  aspectRatio = "video",
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious()
      } else if (event.key === "ArrowRight") {
        goToNext()
      }
    }

    if (isHovered) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isHovered])

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-xs">Rasm mavjud emas</div>
        </div>
      </div>
    )
  }

  // If only one image, show simple image
  if (images.length === 1) {
    return <SimpleImage src={images[0].url} alt={alt} className={className} aspectRatio={aspectRatio} />
  }

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images Container */}
      <div className="relative w-full h-full">
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={image.id} className="w-full h-full flex-shrink-0">
              <SimpleImage
                src={image.url}
                alt={`${alt} - ${index + 1}`}
                className="w-full h-full"
                aspectRatio={aspectRatio}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Touch/Swipe Support */}
      <div
        className="absolute inset-0 touch-pan-y"
        onTouchStart={(e) => {
          const touch = e.touches[0]
          const startX = touch.clientX

          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0]
            const deltaX = touch.clientX - startX

            if (Math.abs(deltaX) > 50) {
              if (deltaX > 0) {
                goToPrevious()
              } else {
                goToNext()
              }
              document.removeEventListener("touchmove", handleTouchMove)
            }
          }

          document.addEventListener("touchmove", handleTouchMove, { passive: true })

          const handleTouchEnd = () => {
            document.removeEventListener("touchmove", handleTouchMove)
            document.removeEventListener("touchend", handleTouchEnd)
          }

          document.addEventListener("touchend", handleTouchEnd, { once: true })
        }}
      />
    </div>
  )
}
