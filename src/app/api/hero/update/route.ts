import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ code: 400, message: "Image URL is required", data: null }),
        { status: 400 }
      );
    }

    // Find the first hero section or create a new one
    const heroSection = await prisma.heroSection.findFirst();

    let updatedHeroSection;

    if (heroSection) {
      // Update existing hero section
      updatedHeroSection = await prisma.heroSection.update({
        where: { id: heroSection.id },
        data: { 
          imageUrl,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new hero section
      updatedHeroSection = await prisma.heroSection.create({
        data: { imageUrl }
      });
    }

    return new Response(
      JSON.stringify({ 
        code: 200, 
        message: "Hero section updated successfully", 
        data: updatedHeroSection 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hero section:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}