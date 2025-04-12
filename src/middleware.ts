
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware() {
  // const token = req.cookies.get("token");
  //  const parseToken = await verifyToken(token?.value || "") as any;

  // const absoluteURL = new URL("/", req.nextUrl.origin);
  // if (!token) {
  //   return NextResponse.redirect(absoluteURL.toString());
  // }

  // if (parseToken.role !== "ADMIN" && req.nextUrl.pathname.startsWith("/admin")) {
  //   console.log("Unauthorized access");
  //   return NextResponse.redirect(absoluteURL.toString());
  // }

  // return NextResponse.next();
}
