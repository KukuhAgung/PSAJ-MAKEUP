import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all gallery items
export async function GET() {
  try {
    let galleryItems = await prisma.galleryItem.findMany()

    if (galleryItems.length === 0) {
      // Create default gallery items with default images
      const defaultGalleryItems = [
        { imageUrl: "/images/gallery/gallery-2.png" },
        { imageUrl: "/images/gallery/gallery-1.png" },
        { imageUrl: "/images/gallery/gallery.png" },
        { imageUrl: "/images/gallery/gallery-5.png" },
        { imageUrl: "/images/gallery/gallery-4.png" },
        { imageUrl: "/images/gallery/gallery-3.png" },
        { imageUrl: "/images/gallery/gallery-8.png" },
        { imageUrl: "/images/gallery/gallery-7.png" },
        { imageUrl: "/images/gallery/gallery-6.png" },
      ]

      // Create all gallery items in a transaction
      galleryItems = await prisma.$transaction(
        defaultGalleryItems.map((item) =>
          prisma.galleryItem.create({
            data: {
              imageUrl: item.imageUrl,
            },
          }),
        ),
      )
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery items retrieved successfully",
        data: galleryItems,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving gallery items:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}

// Create a new gallery item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return new Response(JSON.stringify({ code: 400, message: "Image URL is required", data: null }), { status: 400 })
    }

    // Create a new gallery item
    const newGalleryItem = await prisma.galleryItem.create({
      data: {
        imageUrl,
      },
    })

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery item created successfully",
        data: newGalleryItem,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
