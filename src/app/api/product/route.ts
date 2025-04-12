import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all product sections or create default ones if none exist
    let products = await prisma.productSection.findMany()

    if (products.length === 0) {
      // Create default products with default images
      const defaultProducts = [
        { category: "Wedding", imageUrl: "/images/product/product-01.png" },
        { category: "Graduation", imageUrl: "/images/product/product-02.png" },
        { category: "Party", imageUrl: "/images/product/product-03.png" },
        { category: "Yearbook", imageUrl: "/images/product/product-04.png" },
        { category: "Birthday", imageUrl: "/images/product/product-01.png" },
        { category: "Maternity", imageUrl: "/images/product/product-02.png" },
        { category: "Engangement", imageUrl: "/images/product/product-03.png" },
        { category: "Prewedding", imageUrl: "/images/product/product-04.png" },
      ]

      // Create all products in a transaction
      products = await prisma.$transaction(
        defaultProducts.map((product, index) =>
          prisma.productSection.create({
            data: {
              id: index + 1,
              category: product.category,
              imageUrl: product.imageUrl,
            },
          }),
        ),
      )
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Products retrieved successfully",
        data: products,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving products:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
