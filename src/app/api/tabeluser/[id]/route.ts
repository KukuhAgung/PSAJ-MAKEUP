import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return new Response(
        JSON.stringify({ code: 400, message: "Invalid user ID", data: null }),
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.email) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Username and email are required",
          data: null,
        }),
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new Response(
        JSON.stringify({ code: 404, message: "User not found", data: null }),
        { status: 404 }
      );
    }

    // Check if the email is already used by another user
    if (body.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (emailExists) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: "Email is already in use",
            data: null,
          }),
          { status: 400 }
        );
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
        role: body.role,
      },
    });

    return new Response(
      JSON.stringify({
        code: 200,
        message: "User updated successfully",
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          password: "********", // Always mask the password
          phone: updatedUser.phoneNumber,
          role: updatedUser.role === "ADMIN" ? "Admin" : "User",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}