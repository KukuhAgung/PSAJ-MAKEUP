import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, videoUrl } = body

    if (!videoId || !videoUrl) {
      return new Response(JSON.stringify({ code: 400, message: "Video ID and URL are required", data: null }), {
        status: 400,
      })
    }

    // Find the description video by ID
    const descriptionVideo = await prisma.descriptionSection.findUnique({
      where: { id: Number.parseInt(videoId) },
    })

    if (!descriptionVideo) {
      return new Response(JSON.stringify({ code: 404, message: "Description video not found", data: null }), {
        status: 404,
      })
    }

    // Update the description video
    const updatedDescriptionVideo = await prisma.descriptionSection.update({
      where: { id: Number.parseInt(videoId) },
      data: {
        videoUrl,
        updatedAt: new Date(),
      },
    })

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Description video updated successfully",
        data: updatedDescriptionVideo,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating description video:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
