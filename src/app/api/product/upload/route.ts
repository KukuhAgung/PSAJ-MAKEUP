/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import sharp from "sharp";
import cloudinary from "@/lib/cloudinaryClient";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;
    const cropData = formData.get("cropData") as string | null;

    // Validasi input
    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    if (!productId) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Product ID is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImageBuffer;

    if (cropData) {
      try {
        const { x, y, width, height, scale } = JSON.parse(cropData);

        const actualX = Math.round(x / scale);
        const actualY = Math.round(y / scale);
        const actualWidth = Math.round(width / scale);
        const actualHeight = Math.round(height / scale);

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
          .toBuffer();
      } catch (cropError) {
        console.error("Invalid crop data:", cropError);
        return new Response(
          JSON.stringify({
            code: 400,
            message: "Invalid crop data provided",
            data: null,
          }),
          { status: 400 },
        );
      }
    } else {
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer();
    }


    const filename = `product-${productId}.png`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "content",
            public_id: filename,
            resource_type: "image",
            overwrite: true,
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
        data: { url: imageUrl, productId },
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
