import type { NextRequest } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const cropData = formData.get("cropData") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "User ID is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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
          width: 500,
          height: 500,
          fit: "fill",
        })
        .toBuffer();
    } else {
      // If no crop data, just resize while maintaining aspect ratio
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer();
    }

    // Create a unique filename
    const filename = `profile-${userId}-${Date.now()}.png`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profiles") // Ganti "user-images" dengan nama bucket "profiles"
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
    const { data: publicUrlData } = await supabase.storage
      .from("profiles")
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
        data: { url: publicUrlData.publicUrl, userId },
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
