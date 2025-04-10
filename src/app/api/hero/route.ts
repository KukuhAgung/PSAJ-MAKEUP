import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get the first hero section record or create a default one if none exists
    let heroSection = await prisma.heroSection.findFirst();

    if (!heroSection) {
      // Create a default hero section with the default image
      heroSection = await prisma.heroSection.create({
        data: {
          imageUrl: "/images/grid-image/hero-image.png"
        }
      });
    }

    return new Response(
      JSON.stringify({ 
        code: 200, 
        message: "Hero section retrieved successfully", 
        data: heroSection 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving hero section:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}