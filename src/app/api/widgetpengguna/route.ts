import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Hitung jumlah pengguna dengan role 'USER'
    const userCount = await prisma.user.count({
      where: { role: "USER" },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Success",
        data: {
          totalUsers: userCount,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user count:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}