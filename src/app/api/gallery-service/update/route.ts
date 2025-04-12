import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, itemId, imageUrl } = body

    if (!type || (type !== "hero" && type !== "gallery")) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Type is required and must be 'hero' or 'gallery'",
          data: null,
        }),
        { status: 400 },
      )
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ code: 400, message: "Image URL is required", data: null }), { status: 400 })
    }

    let result

    if (type === "hero") {
      // Find the hero gallery
      const heroGallery = await prisma.heroGallery.findFirst()

      // If no hero gallery exists, create one
      if (!heroGallery) {
        result = await prisma.heroGallery.create({
          data: {
            imageUrl,
          },
        })
      } else {
        // Update the existing hero gallery
        result = await prisma.heroGallery.update({
          where: { id: heroGallery.id },
          data: {
            imageUrl,
            updatedAt: new Date(),
          },
        })
      }
    } else {
      // For gallery items, we need an itemId
      if (!itemId) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: "Item ID is required for gallery items",
            data: null,
          }),
          { status: 400 },
        )
      }

      // Find the gallery item by ID
      const galleryItem = await prisma.galleryItem.findUnique({
        where: { id: Number.parseInt(itemId) },
      })

      if (!galleryItem) {
        return new Response(JSON.stringify({ code: 404, message: "Gallery item not found", data: null }), {
          status: 404,
        })
      }

      // Update the gallery item
      result = await prisma.galleryItem.update({
        where: { id: Number.parseInt(itemId) },
        data: {
          imageUrl,
          updatedAt: new Date(),
        },
      })
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: `${type === "hero" ? "Hero gallery" : "Gallery item"} updated successfully`,
        data: result,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
