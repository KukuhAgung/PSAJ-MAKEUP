import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const videoId = formData.get("videoId") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 },
      );
    }

    if (!videoId) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Video ID is required",
          data: null,
        }),
        { status: 400 },
      );
    }

    // Check if the file is a video
    const fileType = file.type;
    if (!fileType.startsWith("video/")) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "File must be a video",
          data: null,
        }),
        { status: 400 },
      );
    }

    // Get the file extension
    const fileExtension = fileType.split("/")[1];

    // Create a unique filename
    const filename = `video-${videoId}-${Date.now()}.${fileExtension}`;

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("videos") // Ganti "videos" dengan nama bucket Anda
      .upload(filename, buffer, {
        contentType: fileType, // Gunakan tipe file asli
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
      .from("videos")
      .getPublicUrl(filename);

    // Return the public URL of the uploaded file
    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: publicUrlData.publicUrl, videoId },
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
