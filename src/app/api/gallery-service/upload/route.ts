/* eslint-disable @typescript-eslint/no-require-imports */
import { writeFile } from "fs/promises"
import type { NextRequest } from "next/server"
import path from "path"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "hero" or "gallery"
    const itemId = formData.get("itemId") as string // Optional for gallery items
    const cropData = formData.get("cropData") as string

    if (!file) {
      return new Response(JSON.stringify({ code: 400, message: "No file uploaded", data: null }), { status: 400 })
    }

    if (!type || (type !== "hero" && type !== "gallery")) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Type is required and must be 'hero' or 'gallery'",
          data: null,
        }),
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get the original image to extract its dimensions
    const originalImage = await sharp(buffer).metadata()
    const originalWidth = originalImage.width || 800
    const originalHeight = originalImage.height || 600

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
          width: originalWidth,
          height: originalHeight,
          fit: "fill",
        })
        .toBuffer()
    } else {
      // If no crop data, just resize while maintaining aspect ratio
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: originalWidth,
          height: originalHeight,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer()
    }

    // Apply watermark
    // Read the watermark image
    const watermarkPath = path.join(process.cwd(), "public/images/watermark/watermark.png")
    let watermarkBuffer
    try {
      // Check if watermark file exists
      const fs = require("fs")
      if (fs.existsSync(watermarkPath)) {
        watermarkBuffer = await fs.promises.readFile(watermarkPath)
      } else {
        // If watermark doesn't exist, skip watermarking
        console.log("Watermark file not found, skipping watermarking")
      }
    } catch (error) {
      console.error("Error reading watermark file:", error)
    }

    // Apply watermark if available
    if (watermarkBuffer) {
      // Get image dimensions
      const imageMetadata = await sharp(processedImageBuffer).metadata()
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
      processedImageBuffer = await sharp(processedImageBuffer)
        .composite([
          {
            input: resizedWatermark,
            left,
            top,
          },
        ])
        .toBuffer()
    }

    // Create a unique filename based on type
    const filename = type === "hero" ? `gallery-hero-${Date.now()}.png` : `gallery-item-${itemId || Date.now()}.png`

    // Determine the correct directory based on type
    const directory = type === "hero" ? "grid-image" : "gallery"

    const filepath = path.join(process.cwd(), `public/images/${directory}`, filename)

    // Save the processed file
    await writeFile(filepath, processedImageBuffer)

    // Return the path to the saved file
    const imageUrl = `/images/${directory}/${filename}`

    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: imageUrl, type, itemId },
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
