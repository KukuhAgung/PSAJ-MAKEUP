import { writeFile } from "fs/promises"
import type { NextRequest } from "next/server"
import path from "path"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // 'hero', 'banner', or 'gallery'

    if (!file) {
      return new Response(JSON.stringify({ code: 400, message: "No file uploaded", data: null }), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let processedImageBuffer
    let folderPath
    let filename

    // Process the image based on type
    switch (type) {
      case "hero":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 490,
            height: 490,
            fit: "cover",
            position: "center",
          })
          .toBuffer()
        folderPath = "grid-image"
        filename = `hero-image-${Date.now()}.png`
        break

      case "banner":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 800,
            height: 800,
            fit: "cover",
            position: "center",
          })
          .toBuffer()
        folderPath = "product"
        filename = `product-banner-${Date.now()}.png`
        break

      case "gallery":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 400,
            height: 400,
            fit: "cover",
            position: "center",
          })
          .toBuffer()
        folderPath = "gallery/before-after"
        filename = `after-${Date.now()}.png`
        break

      default:
        return new Response(JSON.stringify({ code: 400, message: "Invalid image type", data: null }), { status: 400 })
    }

    const filepath = path.join(process.cwd(), `public/images/${folderPath}`, filename)

    // Save the processed file
    await writeFile(filepath, processedImageBuffer)

    // Return the path to the saved file
    const imageUrl = `/images/${folderPath}/${filename}`

    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: imageUrl },
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), { status: 500 })
  }
}
