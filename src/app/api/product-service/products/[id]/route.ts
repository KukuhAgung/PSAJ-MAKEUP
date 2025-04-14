import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Update a specific product
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split("/").pop(); // Ambil ID dari URL

    if (!productId || isNaN(Number(productId))) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Invalid Product ID format",
          data: null,
        }),
        { status: 400 },
      );
    }

    const body = await request.json();
    const { subtitle, description, banner } = body;

    // Validasi input
    if (!subtitle && !description && !banner) {
      return new Response(
        JSON.stringify({
          code: 400,
          message:
            "At least one field (subtitle, description, or banner) is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    // Update the product
    const updatedProduct = await prisma.itemProduct.update({
      where: { id: productId }, // Konversi ID ke number
      data: {
        subtitle: subtitle || undefined,
        description: description || undefined,
        banner: banner || undefined,
        updatedAt: new Date(),
      },
      include: {
        galleryItems: true, // Include related gallery items
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Product updated successfully",
        data: updatedProduct,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: "Internal Server Error",
        data: null,
      }),
      { status: 500 },
    );
  }
}
