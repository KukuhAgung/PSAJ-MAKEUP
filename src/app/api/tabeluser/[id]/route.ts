import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validasi menggunakan Zod
const updateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().optional(),
  reviewQuota: z.number().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export async function PUT(request: Request) {
  try {
    // Ambil ID dari URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Ambil bagian terakhir dari path sebagai ID

    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ code: 400, message: "Invalid user ID", data: null }),
        { status: 400 },
      );
    }

    const userId = Number(id);

    // Parse body permintaan
    const body = await request.json();

    // Validasi input menggunakan Zod
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Validation failed",
          data: validationResult.error.flatten(), // Detail error yang lebih informatif
        }),
        { status: 400 },
      );
    }

    const { username, email, phoneNumber, reviewQuota, role } =
      validationResult.data;

    // Periksa apakah pengguna ada
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new Response(
        JSON.stringify({ code: 404, message: "User not found", data: null }),
        { status: 404 },
      );
    }

    // Periksa apakah email sudah digunakan oleh pengguna lain
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } }, // Pastikan email tidak dimiliki oleh pengguna lain
      });

      if (emailExists) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: "Email is already in use",
            data: null,
          }),
          { status: 400 },
        );
      }
    }

    // Update data pengguna
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        phoneNumber,
        reviewQuota,
        role,
        updatedAt: new Date(), // Tambahkan timestamp pembaruan
      },
    });

    // Kembalikan respons sukses
    return new Response(
      JSON.stringify({
        code: 200,
        message: "User updated successfully",
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phoneNumber || null, // Handle jika phoneNumber kosong
          role: updatedUser.role === "ADMIN" ? "Admin" : "User",
          updatedAt: updatedUser.updatedAt.toISOString(), // Format tanggal ISO
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    // Tangani error internal server
    console.error("Error updating user:", error);

    // Jangan tampilkan detail teknis kepada klien
    return new Response(
      JSON.stringify({
        code: 500,
        message: "Internal Server Error",
        data: null,
      }),
      { status: 500 },
    );
  }
}
