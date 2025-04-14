import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

// Get a specific gallery item
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Invalid ID",
          data: null,
        }),
        {
          status: 400,
        },
      );
    }

    const galleryItem = await prisma.galleryItem.findUnique({
      where: {
        id: Number(id), // Konversi ID ke tipe number
      },
    });

    if (!galleryItem) {
      return new Response(
        JSON.stringify({
          code: 404,
          message: "Gallery item not found",
          data: null,
        }),
        { status: 404 },
      );
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery item retrieved successfully",
        data: galleryItem,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error retrieving gallery item:", error);
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

// Update a specific gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number.parseInt(params.id);
    const body = await request.json();
    const { imageUrl } = body;

    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ code: 400, message: "Invalid ID format", data: null }),
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Image URL is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    // Check if the gallery item exists
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return new Response(
        JSON.stringify({
          code: 404,
          message: "Gallery item not found",
          data: null,
        }),
        { status: 404 },
      );
    }

    // Update the gallery item
    const updatedGalleryItem = await prisma.galleryItem.update({
      where: { id },
      data: {
        imageUrl,
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

// Delete a specific gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ code: 400, message: "Invalid ID format", data: null }),
        { status: 400 },
      );
    }

    // Check if the gallery item exists
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return new Response(
        JSON.stringify({
          code: 404,
          message: "Gallery item not found",
          data: null,
        }),
        { status: 404 },
      );
    }

    // Delete the gallery item
    await prisma.galleryItem.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Gallery item deleted successfully",
        data: null,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting gallery item:", error);
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
