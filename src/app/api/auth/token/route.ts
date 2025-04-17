import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ code: 400, message: "Email and password are required", data: null }),
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return new Response(
        JSON.stringify({ code: 401, message: "Invalid email or password", data: null }),
        {
          status: 401,
        },
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" },
    );

    const cokiesStore = await cookies();

    cokiesStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return new Response(JSON.stringify({ code: 200, message: "Login successful", data: { token } }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ code: 500,message: "Internal server error", data: null }), {
      status: 500,
    });
  }
}
