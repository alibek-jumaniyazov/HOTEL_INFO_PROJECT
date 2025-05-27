"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Save, Loader2, Plus } from "lucide-react"

interface Room {
  id?: number
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

interface RoomFormProps {
  room?: Room | null
  onClose: () => void
}

export default function RoomForm({ room, onClose }: RoomFormProps) {
  const [formData, setFormData] = useState<Room>({
    name: "",
    price: 0,
    capacity: 1,
    size: 0,
    features: [],
    amenities: ["wifi", "tv", "coffee", "bath"],
    status: "available",
    image: "/placeholder.svg?height=300&width=400",
    description: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (room) {
      setFormData(room)
    }
  }, [room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = room ? `/api/rooms/${room.id}` : "/api/rooms"
      const method = room ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert(room ? "Xona muvaffaqiyatli yangilandi!" : "Yangi xona muvaffaqiyatli qo'shildi!")
        onClose()
      } else {
        alert("Xatolik: " + result.error)
      }
    } catch (error) {
      alert("Ma'lumotlarni saqlashda xatolik")
    } finally {
      setIsSaving(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((feature) => feature !== featureToRemove),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{room ? "Xonani Tahrirlash" : "Yangi Xona Qo'shish"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xona Nomi *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Xona nomi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Narx (so'm/kecha) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Narx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sig'im (kishi) *</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 1 })}
                  placeholder="Sig'im"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maydon (m²) *</label>
                <Input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Maydon"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holat</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Bo'sh</option>
                  <option value="occupied">Band</option>
                  <option value="maintenance">Ta'mirlash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rasm URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Rasm URL"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Xona haqida qisqacha ma'lumot"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xususiyatlar</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Yangi xususiyat qo'shish"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeFeature(feature)}
                  >
                    {feature} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Saqlash
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
