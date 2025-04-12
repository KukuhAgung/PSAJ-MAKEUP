/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDecodedToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();


import { z } from "zod";

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

const testimoniSchema = z.object({
  category: z.enum(categoryOptions, { required_error: "Category must be selected" }),
  description: z.string({ required_error: "Description must be filled" }),
  rating: z
    .number({ required_error: "Rating must be filled" })
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.cookies.get("token");
  const nextAuthToken = req.cookies.get("next-auth.session-token");


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

  try {
    const review = await prisma.review.create({
      data: {
        userId: decoded.payload.id || decoded.id,
        category: category,
        stars: rating,
        comment: description,
      },
    })

    return new Response(
      JSON.stringify({
        code: 201,
        message: "Review created successfully",
        data: review,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating review:", error);
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
