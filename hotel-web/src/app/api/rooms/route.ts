import { type NextRequest, NextResponse } from "next/server"

// Temporary in-memory storage (in real app, use database)
const rooms = [
  {
    id: 1,
    name: "Standart xona",
    price: 150000,
    capacity: 2,
    size: 25,
    features: ["Bepul WiFi", "Konditsioner", "TV", "Mini bar"],
    amenities: ["wifi", "tv", "coffee", "bath"],
    status: "available",
    image: "/placeholder.svg?height=300&width=400",
    description: "Zamonaviy va qulay standart xona",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Deluxe xona",
    price: 250000,
    capacity: 3,
    size: 35,
    features: ["Bepul WiFi", "Balkon", "Jacuzzi", "Room service"],
    amenities: ["wifi", "tv", "coffee", "bath"],
    status: "occupied",
    image: "/placeholder.svg?height=300&width=400",
    description: "Keng va hashamatli deluxe xona",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Suite xona",
    price: 450000,
    capacity: 4,
    size: 60,
    features: ["VIP xizmat", "Alohida yashash xonasi", "Panorama ko'rinish", "Butler xizmati"],
    amenities: ["wifi", "tv", "coffee", "bath", "car"],
    status: "available",
    image: "/placeholder.svg?height=300&width=400",
    description: "Eng yuqori darajadagi suite xona",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET - Barcha xonalarni olish
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: rooms,
      total: rooms.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Xonalarni olishda xatolik",
      },
      { status: 500 },
    )
  }
}

// POST - Yangi xona qo'shish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.capacity || !body.size) {
      return NextResponse.json(
        {
          success: false,
          error: "Majburiy maydonlar to'ldirilmagan",
        },
        { status: 400 },
      )
    }

    // Create new room
    const newRoom = {
      id: Math.max(...rooms.map((r) => r.id)) + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    rooms.push(newRoom)

    return NextResponse.json({
      success: true,
      data: newRoom,
      message: "Yangi xona muvaffaqiyatli qo'shildi",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Xona qo'shishda xatolik",
      },
      { status: 500 },
    )
  }
}
