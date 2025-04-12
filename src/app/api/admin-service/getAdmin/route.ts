import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });
    const admin = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Success",
        data: {
          admin,
          totalCount,
        },
      }),
      { status: 200 },
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
