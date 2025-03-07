import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ code: 401, message: "Unauthorized", data: null }),
      {
        status: 401,
      },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
      select: {
        id: true,
        username: true,
        image: true,
        email: true,
        role: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ code: 404, message: "User not found", data: null }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({ code: 200, message: "Success", data: user }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), {
      status: 500,
    });
  }
}
