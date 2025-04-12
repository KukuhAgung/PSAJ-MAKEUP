import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all portfolio items or create default ones if none exist
    let portfolioItems = await prisma.portfolioSection.findMany()

    if (portfolioItems.length === 0) {
      // Create default portfolio items with default images
      const defaultPortfolioItems = [
        { imageUrl: "/images/grid-image/portfolio-01.png" },
        { imageUrl: "/images/grid-image/portfolio-02.png" },
        { imageUrl: "/images/grid-image/portfolio-03.png" },
      ]

      // Create all portfolio items in a transaction
      portfolioItems = await prisma.$transaction(
        defaultPortfolioItems.map((item, index) =>
          prisma.portfolioSection.create({
            data: {
              id: index + 1,
              imageUrl: item.imageUrl,
            },
          }),
        ),
      )
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Portfolio items retrieved successfully",
        data: portfolioItems,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving portfolio items:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
