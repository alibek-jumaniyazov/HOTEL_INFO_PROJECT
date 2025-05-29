"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw, Eye, ImageIcon } from "lucide-react"
import RoomForm from "./room-form"
import RoomDetails from "./room-details"
import SimpleImage from "@/components/ui/simple-image"
import { RoomsAPI, type Room } from "@/lib/api"

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await RoomsAPI.getAllRooms()

      if (response.success && response.data) {
        console.log("Loaded rooms:", response.data)
        setRooms(response.data)
      } else {
        setError(response.error || "Xonalarni yuklashda xatolik")
      }
    } catch (error) {
      console.error("Error loading rooms:", error)
      setError("Serverga ulanishda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (roomId: number) => {
    if (!confirm("Haqiqatan ham bu xonani o'chirmoqchimisiz?")) {
      return
    }

    try {
      const response = await RoomsAPI.deleteRoom(roomId)

      if (response.success) {
        setRooms(rooms.filter((room) => room.id !== roomId))
        alert("Xona muvaffaqiyatli o'chirildi")
      } else {
        alert("Xatolik: " + (response.error || "Xonani o'chirishda xatolik"))
      }
    } catch (error) {
      alert("Serverga ulanishda xatolik")
    }
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setIsFormOpen(true)
  }

  const handleView = (room: Room) => {
    setViewingRoom(room)
    setIsDetailsOpen(true)
  }

  const handleAddNew = () => {
    setEditingRoom(null)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingRoom(null)
    loadRooms()
  }

  const handleDetailsClose = () => {
    setIsDetailsOpen(false)
    setViewingRoom(null)
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4 text-lg">{error}</div>
        <Button onClick={loadRooms} variant="outline" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Qayta urinish
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-lg text-gray-600">Xonalar yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Xonalarni qidirish..."
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={loadRooms} variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Yangi Xona
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
            <div className="text-sm text-gray-600">Jami xonalar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {rooms.reduce((acc, room) => acc + (room.images?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Jami rasmlar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{filteredRooms.length}</div>
            <div className="text-sm text-gray-600">Ko'rsatilgan xonalar</div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const roomImage = room.images && room.images.length > 0 ? room.images[0].url : undefined
          console.log("Room image URL:", roomImage)

          return (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="p-0">
                <div className="relative">
                  <SimpleImage
                    src={roomImage}
                    alt={room.title}
                    aspectRatio="video"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Image count badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {room.images?.length || 0}
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                      {room.category?.name || "Kategoriasiz"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 truncate flex-1 text-lg">{room.title}</h3>
                  <div className="text-right ml-3">
                    <div className="text-xl font-bold text-blue-600">{room.price}</div>
                    <div className="text-xs text-gray-500">so'm/kecha</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{room.description}</p>

                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Yaratilgan:</span>
                    <span className="font-medium">{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{room.id}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Qulayliklar:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 2).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.amenities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleView(room)}>
                    <Eye className="w-3 h-3 mr-1" />
                    Ko'rish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "Qidiruv bo'yicha xonalar topilmadi" : "Hozircha xonalar mavjud emas"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "Boshqa kalit so'zlar bilan qidiring" : "Birinchi xonangizni qo'shing"}
          </p>
          {!searchTerm && (
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Yangi Xona Qo'shish
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      {isFormOpen && <RoomForm room={editingRoom} onClose={handleFormClose} />}
      {isDetailsOpen && viewingRoom && <RoomDetails room={viewingRoom} onClose={handleDetailsClose} />}
    </div>
  )
}
