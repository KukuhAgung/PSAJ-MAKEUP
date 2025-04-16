/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import sharp from "sharp";
import cloudinary from "@/lib/cloudinaryClient";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process the image using sharp
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width: 495,
        height: 430,
        fit: "cover",
        position: "center",
      })
      .toFormat("png") // Ensure the output is in PNG format
      .toBuffer();

    // Generate a unique filename
    const filename = `hero-image-${Date.now()}`;

    // Upload the processed image buffer to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "content",
            public_id: filename,
            resource_type: "image",
            overwrite: true,
            transformation: [{ width: 495, height: 430, crop: "fill" }],
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
