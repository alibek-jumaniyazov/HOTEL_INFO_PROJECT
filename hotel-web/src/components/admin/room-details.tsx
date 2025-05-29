"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, Tag, DollarSign, ImageIcon, Edit } from "lucide-react"
import ImageCarousel from "@/components/ui/image-carousel"
import type { Room } from "@/lib/api"

interface RoomDetailsProps {
  room: Room
  onClose: () => void
  onEdit?: () => void
}

export default function RoomDetails({ room, onClose, onEdit }: RoomDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-2xl">{room.title}</CardTitle>
            <p className="text-gray-600 mt-1">Xona ID: {room.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Main Image Carousel */}
          <div className="relative overflow-hidden rounded-xl">
            <ImageCarousel
              images={room.images || []}
              alt={room.title}
              className="w-full h-80"
              showArrows={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={5000}
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-600 text-white shadow-lg">{room.category?.name || "Kategoriasiz"}</Badge>
            </div>
          </div>

          {/* Room Info Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Narx</p>
                  <p className="font-bold text-lg text-green-600">{room.price} so'm/kecha</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Kategoriya</p>
                  <p className="font-semibold">{room.category?.name || "Belgilanmagan"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Yaratilgan</p>
                  <p className="font-semibold">{new Date(room.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <ImageIcon className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Rasmlar</p>
                  <p className="font-semibold">{room.images?.length || 0} ta</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Tavsif</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {room.description || "Bu xona uchun tavsif mavjud emas."}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Qulayliklar</h3>
            {room.amenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">Qulayliklar haqida ma'lumot mavjud emas.</p>
            )}
          </div>

          {/* Technical Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Texnik Ma'lumotlar</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono font-medium">{room.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategoriya ID:</span>
                  <span className="font-mono font-medium">{room.categoryId}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Yaratilgan:</span>
                  <span className="font-medium">{new Date(room.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Yangilangan:</span>
                  <span className="font-medium">{new Date(room.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            {onEdit && (
              <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Yopish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
