"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import RoomForm from "./room-form"

interface Room {
  id: number
  name: string
  price: number
  capacity: number
  size: number
  features: string[]
  amenities: string[]
  status: string
  image: string
  description: string
}

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rooms")
      const result = await response.json()

      if (result.success) {
        setRooms(result.data)
      } else {
        alert("Xonalarni yuklashda xatolik: " + result.error)
      }
    } catch (error) {
      alert("Xonalarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (roomId: number) => {
    if (!confirm("Haqiqatan ham bu xonani o'chirmoqchimisiz?")) {
      return
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setRooms(rooms.filter((room) => room.id !== roomId))
        alert("Xona muvaffaqiyatli o'chirildi")
      } else {
        alert("Xatolik: " + result.error)
      }
    } catch (error) {
      alert("Xonani o'chirishda xatolik")
    }
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingRoom(null)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingRoom(null)
    loadRooms() // Reload rooms after form closes
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Xonalar yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Xonalarni qidirish..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yangi Xona
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="p-0">
              <img
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{room.name}</h3>
                <Badge variant={room.status === "available" ? "default" : "secondary"}>
                  {room.status === "available" ? "Bo'sh" : "Band"}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">{room.description}</p>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  Narx: <span className="font-medium">{room.price.toLocaleString()} so'm/kecha</span>
                </p>
                <p>
                  Sig'im: <span className="font-medium">{room.capacity} kishi</span>
                </p>
                <p>
                  Maydon: <span className="font-medium">{room.size} m²</span>
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Xususiyatlar:</p>
                <div className="flex flex-wrap gap-1">
                  {room.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {room.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(room)}>
                  <Edit className="w-3 h-3 mr-1" />
                  Tahrirlash
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Xonalar topilmadi</p>
        </div>
      )}

      {/* Room Form Modal */}
      {isFormOpen && <RoomForm room={editingRoom} onClose={handleFormClose} />}
    </div>
  )
}
