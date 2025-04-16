/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinaryClient";

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
    const filename = `video-${videoId}.${fileExtension}`;

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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
        .end(buffer);
    });

    const imageUrl = (result as any).secure_url;
    // Return the public URL of the uploaded file
    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: imageUrl, videoId },
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
