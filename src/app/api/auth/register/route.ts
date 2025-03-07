import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.username || !body.email || !body.password) {
      return new Response(
        JSON.stringify({ code: 400, message: "All fields are required", data: null }),
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ code: 400, message: "Email already exists", data: null }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        phoneNumber: body.phoneNumber,
      },
    });

    return new Response(
      JSON.stringify({ code: 201, message: "Registration successful", data: newUser }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ code: 500, message: "Internal Server Error", data: null }), {
      status: 500,
    });
  }
}
