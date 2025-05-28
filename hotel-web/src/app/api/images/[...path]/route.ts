import { type NextRequest, NextResponse } from "next/server"

// Backend API dan rasmlarni proxy qilish
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const imagePath = params.path.join("/")
    const backendUrl = `http://localhost:3001/uploads/${imagePath}`

    console.log("Fetching image from:", backendUrl)

    const response = await fetch(backendUrl)

    if (!response.ok) {
      console.log("Image not found:", backendUrl)
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
    console.error("Error fetching image:", error)
    return new NextResponse("Error fetching image", { status: 500 })
  }
}
