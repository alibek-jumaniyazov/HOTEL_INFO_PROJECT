import { type NextRequest, NextResponse } from "next/server";

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
    features: [
      "VIP xizmat",
      "Alohida yashash xonasi",
      "Panorama ko'rinish",
      "Butler xizmati",
    ],
    amenities: ["wifi", "tv", "coffee", "bath", "car"],
    status: "available",
    image: "/placeholder.svg?height=300&width=400",
    description: "Eng yuqori darajadagi suite xona",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - Bitta xonani olish
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = Number.parseInt(params.id);
    const room = rooms.find((r) => r.id === roomId);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: "Xona topilmadi",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: room,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Xonani olishda xatolik",
      },
      { status: 500 }
    );
  }
}

// PUT - Xonani yangilash
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = Number.parseInt(params.id);
    const body = await request.json();

    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Xona topilmadi",
        },
        { status: 404 }
      );
    }

    // Update room
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: rooms[roomIndex],
      message: "Xona muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Xonani yangilashda xatolik",
      },
      { status: 500 }
    );
  }
}

// DELETE - Xonani o'chirish
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = Number.parseInt(params.id);
    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Xona topilmadi",
        },
        { status: 404 }
      );
    }

    // Remove room
    const deletedRoom = rooms.splice(roomIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedRoom,
      message: "Xona muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Xonani o'chirishda xatolik",
      },
      { status: 500 }
    );
  }
}
