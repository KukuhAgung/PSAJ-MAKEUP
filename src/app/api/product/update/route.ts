import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, imageUrl } = body

    if (!productId || !imageUrl) {
      return new Response(JSON.stringify({ code: 400, message: "Product ID and Image URL are required", data: null }), {
        status: 400,
      })
    }

    // Find the product by ID
    const product = await prisma.productSection.findUnique({
      where: { id: Number.parseInt(productId) },
    })

    if (!product) {
      return new Response(JSON.stringify({ code: 404, message: "Product not found", data: null }), { status: 404 })
    }

    // Update the product image
    const updatedProduct = await prisma.productSection.update({
      where: { id: Number.parseInt(productId) },
      data: {
        imageUrl,
        updatedAt: new Date(),
      },
    })

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Product updated successfully",
        data: updatedProduct,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating product:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
