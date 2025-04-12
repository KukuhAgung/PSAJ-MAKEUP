import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(Request: Request) {
  const { searchParams } = new URL(Request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("data") || "10");

  if (size >= 100) {
    return new Response(
      JSON.stringify({
        code: 400,
        message: "Size data must be less than 100",
        data: null,
      }),
    );
  }

  try {
    const totalCount = await prisma.review.count();

    const totalPages = Math.ceil(totalCount / size);

    const averageRating = await prisma.review.aggregate({
      _avg: {
        stars: true,
      },
    });

    const reviews = await prisma.review.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        user: true,
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Reviews retrieved successfully",
        data: {
          reviews,
          pagination: {
            page,
            size,
            totalPages,
          },
          totalCount,
          averageRating: averageRating._avg.stars || 0,
        },
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error getting review:", error);
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
