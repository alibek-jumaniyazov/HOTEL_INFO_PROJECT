"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, ImageIcon, Plus, FileImage } from "lucide-react"
import type { RoomImage } from "@/lib/api"
import ImagePlaceholder from "@/components/ui/image-placeholder"

interface ImageUploadProps {
  selectedFiles: File[]
  onFilesChange: (files: File[]) => void
  existingImages: RoomImage[]
  onRemoveExisting: (imageId: number) => void
  disabled?: boolean
}

export default function ImageUpload({
  selectedFiles,
  onFilesChange,
  existingImages,
  onRemoveExisting,
  disabled = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create preview URLs for selected files
  const getPreviewUrl = useCallback(
    (file: File) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`
      if (!previewUrls[fileKey]) {
        const url = URL.createObjectURL(file)
        setPreviewUrls((prev) => ({ ...prev, [fileKey]: url }))
        return url
      }
      return previewUrls[fileKey]
    },
    [previewUrls],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
        if (newFiles.length > 0) {
          onFilesChange([...selectedFiles, ...newFiles])
        }
      }
    },
    [selectedFiles, onFilesChange, disabled],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      if (newFiles.length > 0) {
        onFilesChange([...selectedFiles, ...newFiles])
      }
    }
  }

  const removeSelectedFile = (index: number) => {
    const fileToRemove = selectedFiles[index]
    const fileKey = `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`

    // Revoke URL to prevent memory leaks
    if (previewUrls[fileKey]) {
      URL.revokeObjectURL(previewUrls[fileKey])
      setPreviewUrls((prev) => {
        const newUrls = { ...prev }
        delete newUrls[fileKey]
        return newUrls
      })
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Xona Rasmlari
          <span className="text-gray-500 ml-1">(Ixtiyoriy)</span>
        </label>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Area */}
        <Card
          className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <CardContent className="p-8 text-center">
            <div className={`transition-transform duration-200 ${dragActive ? "scale-110" : ""}`}>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {dragActive ? "Rasmlarni bu yerga tashlang" : "Rasmlarni yuklash"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">Rasmlarni bu yerga tortib tashlang yoki yuklash uchun bosing</p>
              <Button type="button" variant="outline" disabled={disabled} className="pointer-events-none">
                <Plus className="w-4 h-4 mr-2" />
                Rasmlarni tanlash
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                PNG, JPG, JPEG formatlarini qo'llab-quvvatlaydi • Maksimal 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview of selected files */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <FileImage className="w-4 h-4 mr-2" />
            Yangi rasmlar ({selectedFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => {
              const fileKey = `${file.name}-${file.size}-${file.lastModified}`
              const previewUrl = getPreviewUrl(file)

              return (
                <div key={fileKey} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <ImagePlaceholder
                      src={previewUrl || ""}
                      alt={`Preview ${index + 1}`}
                      aspectRatio="square"
                      className="w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSelectedFile(index)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                    disabled={disabled}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                    {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                  </div>
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Existing images (for edit mode) */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Mavjud rasmlar ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div key={`existing-${image.id}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  <ImagePlaceholder
                    src={image.url || ""}
                    alt={`Room image ${image.id}`}
                    aspectRatio="square"
                    className="w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveExisting(image.id)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">Mavjud</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No images message */}
      {selectedFiles.length === 0 && existingImages.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-2">Hozircha rasmlar mavjud emas</p>
          <p className="text-xs text-gray-400">Yuqoridagi tugma orqali rasmlar qo'shing</p>
        </div>
      )}

      {/* Upload tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Maslahatlar:</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Eng yaxshi sifat uchun 1200x800 piksel yoki undan yuqori o'lchamdagi rasmlar ishlating</li>
          <li>• Birinchi rasm asosiy rasm sifatida ko'rsatiladi</li>
          <li>• Bir vaqtda bir nechta rasmlarni yuklashingiz mumkin</li>
          <li>• Qo'llab-quvvatlanadigan formatlar: JPG, PNG, JPEG</li>
        </ul>
      </div>
    </div>
  )
}
