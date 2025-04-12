import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get hero gallery
export async function GET() {
  try {
    let heroGallery = await prisma.heroGallery.findFirst()

    // If no hero gallery exists, create a default one
    if (!heroGallery) {
      heroGallery = await prisma.heroGallery.create({
        data: {
          imageUrl: "/images/grid-image/gallery-hero.png",
        },
      })
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Hero gallery retrieved successfully",
        data: heroGallery,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving hero gallery:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}

// Update hero gallery
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return new Response(JSON.stringify({ code: 400, message: "Image URL is required", data: null }), { status: 400 })
    }

    // Find the hero gallery
    let heroGallery = await prisma.heroGallery.findFirst()

    // If no hero gallery exists, create one
    if (!heroGallery) {
      heroGallery = await prisma.heroGallery.create({
        data: {
          imageUrl,
        },
      })
    } else {
      // Update the existing hero gallery
      heroGallery = await prisma.heroGallery.update({
        where: { id: heroGallery.id },
        data: {
          imageUrl,
          updatedAt: new Date(),
        },
      })
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Hero gallery updated successfully",
        data: heroGallery,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating hero gallery:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
