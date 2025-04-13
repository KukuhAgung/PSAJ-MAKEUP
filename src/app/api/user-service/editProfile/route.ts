/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDecodedToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookiesStore = await cookies(); // Perbaiki typo "cokiesStore" menjadi "cookiesStore"
  const token = req.cookies.get("token");
  const nextAuthToken = req.cookies.get("next-auth.session-token");

  async function setCookies(token: string) {
    cookiesStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

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

  let hashedPassword = "";

  if (body.password !== "") {
    hashedPassword = await bcrypt.hash(body.password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.payload.id || decoded.id,
      },
      data: {
        ...(body.image && { image: body.image }),
        username: body.name,
        email: body.email,
        address: body.address,
        phoneNumber: body.phoneNumber,
        ...(body.password && { password: hashedPassword }),
      },
    });

    const newToken = jwt.sign(
      {
        id: decoded.payload.id || decoded.id,
        username: body.name,
        email: body.email,
        role: decoded.payload.role || "USER",
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" },
    );

    // Periksa apakah nama berubah
    const isUsernameChanged =
      decoded.payload?.username !== body.name || decoded.username !== body.name;

    // Set token baru jika nama berubah atau sebagai default behavior
    if (isUsernameChanged) {
      await setCookies(newToken);
    }

    return new Response(
      JSON.stringify({
        code: 201,
        message: "Profile updated successfully",
        data: updatedUser,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error updating profile:", error);
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
