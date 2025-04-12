import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const galleryItemId = params.id
    const body = await request.json()
    const { image } = body

    if (!image) {
      return new Response(JSON.stringify({ code: 400, message: "Image URL is required", data: null }), { status: 400 })
    }

    // Update the gallery item
    const updatedGalleryItem = await prisma.galleryProduct.update({
      where: { id: galleryItemId },
      data: {
        image,
        updatedAt: new Date(),
      },
    })

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery item updated successfully",
        data: updatedGalleryItem,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
