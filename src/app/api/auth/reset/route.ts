import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { code: 400, message: "Email is required", data: null },
        { status: 400 },
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL}/reset-password`,
    });

    if (error) {
      console.error("Error sending reset password email:", error);
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to send reset password email",
          data: null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        code: 200,
        message: "Reset password email sent successfully",
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in reset password API:", error);
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", data: error },
      { status: 500 },
    );
  }
}
