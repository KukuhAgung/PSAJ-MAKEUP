import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Update a specific gallery item
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Ambil ID dari URL

    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Invalid ID format",
          data: null,
        }),
        { status: 400 },
      );
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Image URL is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    // Update the gallery item
    const updatedGalleryItem = await prisma.galleryProduct.update({
      where: { id: id }, // Konversi ID ke number
      data: {
        image,
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery item updated successfully",
        data: updatedGalleryItem,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating gallery item:", error);
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
