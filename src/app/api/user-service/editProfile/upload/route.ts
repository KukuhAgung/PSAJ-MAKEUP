/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinaryClient";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a unique filename
    const filename = `profile-${userId}.png`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "content",
            public_id: filename,
            resource_type: "image",
            overwrite: true,
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
              },
            ],
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
        data: { url: imageUrl, userId },
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
