import type { NextRequest } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'hero', 'banner', or 'gallery'

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImageBuffer;
    let folderPath;
    let filename;

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
          .toBuffer();
        folderPath = "grid-image";
        filename = `hero-image-${Date.now()}.png`;
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
        folderPath = "product";
        filename = `product-banner-${Date.now()}.png`;
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
        folderPath = "gallery/before-after";
        filename = `after-${Date.now()}.png`;
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

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("images") // Ganti "images" dengan nama bucket Anda
      .upload(`${folderPath}/${filename}`, processedImageBuffer, {
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
      .from("images")
      .getPublicUrl(`${folderPath}/${filename}`);

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
        data: { url: publicUrlData.publicUrl },
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
