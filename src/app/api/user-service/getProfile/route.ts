/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDecodedToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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

    const email = await decoded.email || decoded.payload.email;
    
    const user = await prisma.user.findUnique({
      where: { email: email },
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
