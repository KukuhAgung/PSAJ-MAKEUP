import { NextRequest } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient";

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
        width: 490,
        height: 490,
        fit: "cover",
        position: "center",
      })
      .toFormat("png") // Ensure the output is in PNG format
      .toBuffer();

    // Generate a unique filename
    const filename = `hero-image-${Date.now()}.png`;

    // Upload the processed image to Supabase Storage
    const { error } = await supabase.storage
      .from("content") // Bucket name
      .upload(filename, processedImageBuffer, {
        contentType: "image/png", // Set MIME type
        upsert: false, // Prevent overwriting existing files
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return new Response(
        JSON.stringify({
          code: 500,
          message: "Failed to upload to Supabase",
          data: null,
        }),
        { status: 500 },
      );
    }

    // Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from("content")
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;

    // Return success response with the image URL
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
