import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get the first hero section record or create a default one if none exists
    let heroProduct = await prisma.heroProduct.findFirst()

    if (!heroProduct) {
      // Create a default hero section with the default image
      heroProduct = await prisma.heroProduct.create({
        data: {
          imageUrl: "/images/grid-image/hero-image.png",
        },
      })
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Hero product retrieved successfully",
        data: heroProduct,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving hero product:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
