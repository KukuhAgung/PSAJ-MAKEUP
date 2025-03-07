import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cokiesStore = await cookies();

  cokiesStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ code: 200, message: "Logged out successfully" });
}
