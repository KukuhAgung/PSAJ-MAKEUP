import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { portfolioId, imageUrl } = body

    if (!portfolioId || !imageUrl) {
      return new Response(
        JSON.stringify({ code: 400, message: "Portfolio ID and Image URL are required", data: null }),
        {
          status: 400,
        },
      )
    }

    // Find the portfolio item by ID
    const portfolioItem = await prisma.portfolioSection.findUnique({
      where: { id: Number.parseInt(portfolioId) },
    })

    if (!portfolioItem) {
      return new Response(JSON.stringify({ code: 404, message: "Portfolio item not found", data: null }), {
        status: 404,
      })
    }

    // Update the portfolio image
    const updatedPortfolioItem = await prisma.portfolioSection.update({
      where: { id: Number.parseInt(portfolioId) },
      data: {
        imageUrl,
        updatedAt: new Date(),
      },
    })

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Portfolio item updated successfully",
        data: updatedPortfolioItem,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
