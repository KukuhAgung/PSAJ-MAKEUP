// import { NextRequest } from "next/server";
// import { supabase } from "@/lib/supabaseClient";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   try {
//     const { password, confirmPassword, token } = await request.json();

//     if (!password || !confirmPassword || !token) {
//       return new Response(
//         JSON.stringify({
//           code: 400,
//           message: "All fields are required",
//           data: null,
//         }),
//         { status: 400 },
//       );
//     }

//     const confirmToken = token === process.env.PASSWORD_RESET_PARAM;

//     if (!confirmToken) {
//       return (
//         new Response(
//           JSON.stringify({
//             code: 400,
//             message: "Invalid link",
//             data: null,
//           }),
//         ),
//         { status: 400 }
//       );
//     }

//     if (!findEmail) {
//       return new Response(
//         JSON.stringify({ code: 404, message: "Email not found", data: null }),
//         { status: 404 },
//       );
//     }

//     const { error } = await supabase.auth.resetPasswordForEmail(email);

//     if (error) {
//       console.error("Error sending reset password email:", error);
//       return new Response(
//         JSON.stringify({
//           code: 500,
//           message: "Internal Server Error",
//           data: error,
//         }),
//         { status: 500 },
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         code: 200,
//         message: "Reset password email sent",
//         data: email,
//       }),
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error in reset password API:", error);
//     return new Response(
//       JSON.stringify({
//         code: 500,
//         message: "Internal Server Error",
//         data: error,
//       }),
//       { status: 500 },
//     );
//   }
// }
