import { writeFile } from "fs/promises"
import type { NextRequest } from "next/server"
import path from "path"
import sharp from "sharp"


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const cropData = formData.get("cropData") as string

    if (!file) {
      return new Response(JSON.stringify({ code: 400, message: "No file uploaded", data: null }), { status: 400 })
    }

    if (!userId) {
      return new Response(JSON.stringify({ code: 400, message: "Product ID is required", data: null }), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let processedImageBuffer

    // If crop data is provided, use it to crop the image
    if (cropData) {
      const { x, y, width, height, scale } = JSON.parse(cropData)

      // Calculate the actual crop dimensions based on the scale
      const actualX = Math.round(x / scale)
      const actualY = Math.round(y / scale)
      const actualWidth = Math.round(width / scale)
      const actualHeight = Math.round(height / scale)

      // Process the image with the crop settings
      processedImageBuffer = await sharp(buffer)
        .extract({
          left: actualX,
          top: actualY,
          width: actualWidth,
          height: actualHeight,
        })
        .resize({
          width: 500,
          height: 500,
          fit: "fill",
        })
        .toBuffer()
    } else {
      // If no crop data, just resize while maintaining aspect ratio
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer()
    }

    // Create a unique filename
    const filename = `user-${userId}-${Date.now()}.png`
    const filepath = path.join(process.cwd(), "public/images/user", filename)

    // Save the processed file
    await writeFile(filepath, processedImageBuffer)

    // Return the path to the saved file
    const imageUrl = `/images/user/${filename}`

    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: imageUrl, userId },
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
