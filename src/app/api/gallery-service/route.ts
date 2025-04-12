import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get hero gallery
    let heroGallery = await prisma.heroGallery.findFirst()

    // If no hero gallery exists, create a default one
    if (!heroGallery) {
      heroGallery = await prisma.heroGallery.create({
        data: {
          imageUrl: "/images/grid-image/gallery-hero.png",
        },
      })
    }

    // Get all gallery items or create default ones if none exist
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
        message: "Gallery data retrieved successfully",
        data: {
          hero: heroGallery,
          gallery: galleryItems,
        },
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving gallery data:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
