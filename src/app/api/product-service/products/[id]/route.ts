import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    const product = await prisma.itemProduct.findUnique({
      where: { id: productId },
      include: {
        galleryItems: true,
      },
    })

    if (!product) {
      return new Response(JSON.stringify({ code: 404, message: "Product not found", data: null }), { status: 404 })
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Product retrieved successfully",
        data: product,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving product:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const body = await request.json()
    const { subtitle, description, banner } = body

    // Update the product
    const updatedProduct = await prisma.itemProduct.update({
      where: { id: productId },
      data: {
        subtitle: subtitle || undefined,
        description: description || undefined,
        banner: banner || undefined,
        updatedAt: new Date(),
      },
      include: {
        galleryItems: true,
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
