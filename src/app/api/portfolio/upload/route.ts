/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextRequest } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import path from "path";
const fs = require("fs");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const portfolioId = formData.get("portfolioId") as string;
    const cropData = formData.get("cropData") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    if (!portfolioId) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Portfolio ID is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get the original image to extract its dimensions
    const originalImage = await sharp(buffer).metadata();
    const originalWidth = originalImage.width || 800;
    const originalHeight = originalImage.height || 600;

    let processedImageBuffer;

    // If crop data is provided, use it to crop the image
    if (cropData) {
      const { x, y, width, height, scale } = JSON.parse(cropData);

      // Calculate the actual crop dimensions based on the scale
      const actualX = Math.round(x / scale);
      const actualY = Math.round(y / scale);
      const actualWidth = Math.round(width / scale);
      const actualHeight = Math.round(height / scale);

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
        .toBuffer();
    } else {
      // If no crop data, just resize while maintaining aspect ratio
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: originalWidth,
          height: originalHeight,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer();
    }

    // Apply watermark
    // Read the watermark image
    const watermarkPath = path.join(
      process.cwd(),
      "public/images/watermark/watermark.png",
    );
    let watermarkBuffer;

    try {
      // Check if watermark file exists
      if (fs.existsSync(watermarkPath)) {
        watermarkBuffer = await fs.promises.readFile(watermarkPath);
      } else {
        console.log("Watermark file not found, skipping watermarking");
      }
    } catch (error) {
      console.error("Error reading watermark file:", error);
    }

    // Apply watermark if available
    if (watermarkBuffer) {
      // Get image dimensions
      const imageMetadata = await sharp(processedImageBuffer).metadata();
      const watermarkMetadata = await sharp(watermarkBuffer).metadata();

      // Resize watermark to be proportional to the image (e.g., 30% of the image width)
      const watermarkWidth = Math.round(imageMetadata.width! * 0.3);
      const watermarkHeight = Math.round(
        (watermarkWidth / watermarkMetadata.width!) * watermarkMetadata.height!,
      );

      const resizedWatermark = await sharp(watermarkBuffer)
        .resize(watermarkWidth, watermarkHeight)
        .toBuffer();

      // Calculate position (bottom right corner with some padding)
      const padding = Math.round(imageMetadata.width! * 0.05); // 5% padding
      const left = imageMetadata.width! - watermarkWidth - padding;
      const top = imageMetadata.height! - watermarkHeight - padding;

      // Apply watermark
      processedImageBuffer = await sharp(processedImageBuffer)
        .composite([
          {
            input: resizedWatermark,
            left,
            top,
          },
        ])
        .toBuffer();
    }

    // Create a unique filename
    const filename = `portfolio-${portfolioId}-${Date.now()}.png`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("portfolio-images") // Ganti "portfolio-images" dengan nama bucket Anda
      .upload(filename, processedImageBuffer, {
        contentType: "image/png", // Sesuaikan dengan tipe file
      });

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return new Response(
        JSON.stringify({
          code: 500,
          message: "Failed to upload file",
          data: null,
        }),
        { status: 500 },
      );
    }

    // Generate public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filename);

    // Validate public URL
    if (!publicUrlData?.publicUrl) {
      console.error("Failed to generate public URL");
      return new Response(
        JSON.stringify({
          code: 500,
          message: "Failed to generate public URL",
          data: null,
        }),
        { status: 500 },
      );
    }

    // Return the public URL of the uploaded file
    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: publicUrlData.publicUrl, portfolioId },
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
