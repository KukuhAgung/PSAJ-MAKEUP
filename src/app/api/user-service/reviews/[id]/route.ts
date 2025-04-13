import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  // Validasi ID
  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({
        code: 400,
        message: "Invalid ID",
        data: null,
      }),
      {
        status: 400,
      },
    );
  }

  try {
    // Query untuk mendapatkan review berdasarkan ID
    const review = await prisma.review.findUnique({
      where: {
        id: Number(id), // Konversi ID ke tipe number
      },
      include: {
        user: true, // Include data user jika ada relasi dengan tabel User
      },
    });

    // Jika review tidak ditemukan
    if (!review) {
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

    // Jika review ditemukan, kembalikan respons sukses
    return new Response(
      JSON.stringify({
        code: 200,
        message: "Review retrieved successfully",
        data: review,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error getting review by ID:", error);
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
