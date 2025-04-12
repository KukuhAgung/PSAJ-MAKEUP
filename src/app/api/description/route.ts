import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all description videos or create default ones if none exist
    let descriptionVideos = await prisma.descriptionSection.findMany()

    if (descriptionVideos.length === 0) {
      // Create default description videos with default videos
      const defaultVideos = [
        { videoUrl: "/videos/Video1.mp4" },
        { videoUrl: "/videos/Video1.mp4" },
        { videoUrl: "/videos/Video1.mp4" },
        { videoUrl: "/videos/Video1.mp4" },
      ]

      // Create all description videos in a transaction
      descriptionVideos = await prisma.$transaction(
        defaultVideos.map((video, index) =>
          prisma.descriptionSection.create({
            data: {
              id: index + 1,
              videoUrl: video.videoUrl,
            },
          }),
        ),
      )
    }

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Description videos retrieved successfully",
        data: descriptionVideos,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving description videos:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
