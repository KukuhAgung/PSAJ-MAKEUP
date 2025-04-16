/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import sharp from "sharp";
import cloudinary from "@/lib/cloudinaryClient";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImageBuffer;
    let filename;

    switch (type) {
      case "hero":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 495,
            height: 430,
            fit: "cover",
            position: "center",
          })
          .toBuffer();
        filename = `hero-image-product`;
        break;

      case "banner":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 800,
            height: 800,
            fit: "cover",
            position: "center",
          })
          .toBuffer();
        filename = `product-banner-${Date.now()}`;
        break;

      case "gallery":
        processedImageBuffer = await sharp(buffer)
          .resize({
            width: 400,
            height: 400,
            fit: "cover",
            position: "center",
          })
          .toBuffer();
        filename = `after-${Date.now()}`;
        break;

      default:
        return new Response(
          JSON.stringify({
            code: 400,
            message: "Invalid image type",
            data: null,
          }),
          { status: 400 },
        );
    }

    // Upload the processed image buffer to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "content",
            public_id: filename,
            resource_type: "image",
            overwrite: false,
          },
          (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(processedImageBuffer);
    });

    const imageUrl = (result as any).secure_url;

    // Return the public URL of the uploaded file
    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: imageUrl },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file:", error);
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
