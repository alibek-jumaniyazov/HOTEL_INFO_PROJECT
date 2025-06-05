// app/api/images/[...path]/route.ts

import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const imagePath = params.path.join("/")
    const backendUrl = `http://localhost:3001/uploads/${imagePath}`

    const response = await fetch(backendUrl)

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/jpeg"

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.log("Error fetching image:", error);
    return new NextResponse("Error fetching image", { status: 500 })
  }
}
