import { type NextRequest, NextResponse } from "next/server"

// Temporary in-memory storage (in real app, use database)
let hotelData = {
  id: 1,
  name: "Luxury Hotel",
  description:
    "Toshkent markazida joylashgan zamonaviy 5 yulduzli mehmonxona. Biz mijozlarimizga eng yuqori sifatli xizmat va unutilmas tajriba taqdim etamiz.",
  address: "Toshkent, Amir Temur ko'chasi 15",
  phone: "+998 90 123 45 67",
  email: "info@luxuryhotel.uz",
  features: ["Bepul WiFi", "Parking", "Restaurant", "Fitnes zal", "Spa", "Biznes markaz"],
  image: "/placeholder.svg?height=600&width=800",
  rating: 5.0,
  totalRooms: 150,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// GET - Hotel ma'lumotlarini olish
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: hotelData,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Hotel ma'lumotlarini olishda xatolik",
      },
      { status: 500 },
    )
  }
}

// PUT - Hotel ma'lumotlarini yangilash
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.address || !body.phone || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Majburiy maydonlar to'ldirilmagan",
        },
        { status: 400 },
      )
    }

    // Update hotel data
    hotelData = {
      ...hotelData,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: hotelData,
      message: "Hotel ma'lumotlari muvaffaqiyatli yangilandi",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Hotel ma'lumotlarini yangilashda xatolik",
      },
      { status: 500 },
    )
  }
}
