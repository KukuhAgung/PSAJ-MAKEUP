import type { NextRequest } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImageBuffer;

    // Proses cropping jika ada cropData
    if (cropData) {
      try {
        const { x, y, width, height, scale } = JSON.parse(cropData);

        // Hitung dimensi crop berdasarkan skala
        const actualX = Math.round(x / scale);
        const actualY = Math.round(y / scale);
        const actualWidth = Math.round(width / scale);
        const actualHeight = Math.round(height / scale);

        // Crop gambar menggunakan sharp
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
            fit: "fill", // Mengisi area tanpa mempertahankan aspek rasio
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
      // Jika tidak ada cropData, resize gambar saja
      processedImageBuffer = await sharp(buffer)
        .resize({
          width: 500,
          height: 500,
          fit: "contain", // Mempertahankan aspek rasio
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Background transparan
        })
        .toBuffer();
    }

    // Buat nama file unik
    const filename = `product-${productId}-${Date.now()}.png`;

    // Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("content") // Ganti "content" dengan nama bucket Anda
      .upload(filename, processedImageBuffer, {
        contentType: "image/png", // Sesuaikan dengan tipe file
        upsert: false, // Tidak mengizinkan overwrite file yang sudah ada
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

    // Dapatkan public URL dari file yang diunggah
    const { data: publicUrlData } = supabase.storage
      .from("content")
      .getPublicUrl(filename);

    const publicUrl = publicUrlData.publicUrl;

    // Kembalikan respons sukses dengan URL publik
    return new Response(
      JSON.stringify({
        code: 200,
        message: "File uploaded successfully",
        data: { url: publicUrl, productId },
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
