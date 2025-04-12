import { writeFile } from "fs/promises"
import type { NextRequest } from "next/server"
import path from "path"
import fs from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const videoId = formData.get("videoId") as string

    if (!file) {
      return new Response(JSON.stringify({ code: 400, message: "No file uploaded", data: null }), { status: 400 })
    }

    if (!videoId) {
      return new Response(JSON.stringify({ code: 400, message: "Video ID is required", data: null }), { status: 400 })
    }

    // Check if the file is a video
    const fileType = file.type
    if (!fileType.startsWith("video/")) {
      return new Response(JSON.stringify({ code: 400, message: "File must be a video", data: null }), { status: 400 })
    }

    // Get the file extension
    const fileExtension = fileType.split("/")[1]

    // Create a unique filename
    const filename = `video-${videoId}-${Date.now()}.${fileExtension}`
    const filepath = path.join(process.cwd(), "public/videos", filename)

    // Ensure the videos directory exists
    const videosDir = path.join(process.cwd(), "public/videos")
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true })
    }

    // Convert the file to a buffer and save it
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the path to the saved file
    const videoUrl = `/videos/${filename}`

    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: videoUrl, videoId },
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
