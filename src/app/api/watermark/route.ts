import type { NextRequest } from "next/server"
import sharp from "sharp"
import path from "path"
import { readFile } from "fs/promises"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const watermarkPath = (formData.get("watermarkPath") as string) || "/images/watermark/watermark.png"

    if (!imageFile) {
      return new Response(JSON.stringify({ code: 400, message: "No image provided", data: null }), { status: 400 })
    }

    // Convert the uploaded image to a buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    // Get the watermark image
    let watermarkBuffer
    try {
      const fullWatermarkPath = path.join(process.cwd(), "public", watermarkPath.replace(/^\//, ""))
      watermarkBuffer = await readFile(fullWatermarkPath)
    } catch (error) {
      console.error("Error reading watermark file:", error)
      return new Response(JSON.stringify({ code: 500, message: "Error reading watermark file", data: null }), {
        status: 500,
      })
    }

    // Get image dimensions
    const imageMetadata = await sharp(imageBuffer).metadata()
    const watermarkMetadata = await sharp(watermarkBuffer).metadata()

    // Resize watermark to be proportional to the image (e.g., 30% of the image width)
    const watermarkWidth = Math.round(imageMetadata.width! * 0.3)
    const watermarkHeight = Math.round((watermarkWidth / watermarkMetadata.width!) * watermarkMetadata.height!)

    const resizedWatermark = await sharp(watermarkBuffer).resize(watermarkWidth, watermarkHeight).toBuffer()

    // Calculate position (bottom right corner with some padding)
    const padding = Math.round(imageMetadata.width! * 0.05) // 5% padding
    const left = imageMetadata.width! - watermarkWidth - padding
    const top = imageMetadata.height! - watermarkHeight - padding

    // Apply watermark
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: resizedWatermark,
          left,
          top,
        },
      ])
      .toBuffer()

    // Return the watermarked image
    return new Response(watermarkedImage, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (error) {
    console.error("Error applying watermark:", error)
    return new Response(JSON.stringify({ code: 500, message: "Error applying watermark", data: null }), { status: 500 })
  }
}
