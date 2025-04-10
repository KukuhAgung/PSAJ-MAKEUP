import { writeFile } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';
import sharp from 'sharp'; // You'll need to install this: npm install sharp

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ code: 400, message: "No file uploaded", data: null }),
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process the image to ensure it fits correctly
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width: 490,
        height: 490,
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    // Create a unique filename
    const filename = `hero-image-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public/images/grid-image', filename);

    // Save the processed file
    await writeFile(filepath, processedImageBuffer);

    // Return the path to the saved file
    const imageUrl = `/images/grid-image/${filename}`;

    return new Response(
      JSON.stringify({ 
        code: 200, 
        message: "File uploaded successfully", 
        data: { url: imageUrl } 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}