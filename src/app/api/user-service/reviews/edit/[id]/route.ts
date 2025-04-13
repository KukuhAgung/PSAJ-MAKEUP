/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDecodedToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

import { z } from "zod";

// Daftar kategori yang valid
const categoryOptions = [
  "wedding",
  "graduation",
  "party",
  "yearbook",
  "birthday",
  "maternity",
  "engangement",
  "prewedding",
] as const;

// Schema validasi untuk input testimoni
const testimoniSchema = z.object({
  category: z.enum(categoryOptions, {
    required_error: "Category must be selected",
  }),
  description: z.string({ required_error: "Description must be filled" }),
  rating: z
    .number({ required_error: "Rating must be filled" })
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const token = req.cookies.get("token");
  const nextAuthToken = req.cookies.get("next-auth.session-token");

  // Pastikan pengguna memiliki token
  if (!token && !nextAuthToken) {
    return new Response(
      JSON.stringify({ code: 401, message: "Unauthorized", data: null }),
      {
        status: 401,
      },
    );
  }

  let decoded: any = null;

  try {
    // Verifikasi token
    if (token) {
      decoded = await getDecodedToken(token.value, "token");
    } else if (nextAuthToken) {
      decoded = await getDecodedToken(nextAuthToken.value, "next-auth");
    }

    if (!decoded) {
      return new Response(
        JSON.stringify({ code: 401, message: "Invalid token", data: null }),
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response(
      JSON.stringify({ code: 401, message: "Invalid token", data: null }),
      {
        status: 401,
      },
    );
  }

  // Validasi input
  const validationResult = testimoniSchema.safeParse(body);

  if (!validationResult.success) {
    const errors = validationResult.error.format();
    return new Response(
      JSON.stringify({
        code: 400,
        message: "Bad Request",
        data: errors,
      }),
      {
        status: 400,
      },
    );
  }

  const { rating, description, category } = validationResult.data;
  const { id } = params;

  try {
    // Cek apakah review dengan ID tertentu ada
    const existingReview = await prisma.review.findUnique({
      where: {
        id: Number(id), // Konversi ID ke tipe number
      },
    });

    if (!existingReview) {
      return new Response(
        JSON.stringify({
          code: 404,
          message: "Review not found",
          data: null,
        }),
        {
          status: 404,
        },
      );
    }

    // Pastikan hanya pemilik review atau admin yang dapat mengedit
    if (existingReview.userId !== (decoded.payload.id || decoded.id)) {
      return new Response(
        JSON.stringify({
          code: 403,
          message: "Forbidden: You are not authorized to edit this review",
          data: null,
        }),
        {
          status: 403,
        },
      );
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: {
        id: Number(id),
      },
      data: {
        category: category,
        stars: rating,
        comment: description,
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Review updated successfully",
        data: updatedReview,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: "Internal Server Error",
        data: null,
      }),
      {
        status: 500,
      },
    );
  }
}
