import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map the database users to match the format expected by the table
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "********", // Always mask the password for security
      phone: user.phoneNumber || "", // Match the property name in your table component
      role: user.role === "ADMIN" ? "Admin" : "User", // Format role to match table expectations
    }));

    return new Response(
      JSON.stringify({
        code: 200,
        message: "Users retrieved successfully",
        data: formattedUsers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving users:", error);
    return new Response(
      JSON.stringify({ code: 500, message: "Internal Server Error", data: null }),
      { status: 500 }
    );
  }
}