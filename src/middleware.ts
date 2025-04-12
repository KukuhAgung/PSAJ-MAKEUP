/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import { decode } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;
const PUBLIC_PATHS = ["/beranda", "/product", "/gallery"];
const PRIVATE_PATHS = ["/profile"];
const PROTECTED_PATHS = ["/admin"];

async function getDecodedToken(token?: string, type?: string) {
  try {
    if (!token) return null;
    switch (type) {
      case "token":
        return await verifyToken(token);
      case "next-auth":
        return await decode({
          token,
          secret,
        });
      default:
        return null;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const absoluteURL = new URL("/", req.nextUrl.origin);
  const publicPathMatch = PUBLIC_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  const privatePathMatch = PRIVATE_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  const protectedPathMatch = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (publicPathMatch) {
    return NextResponse.next();
  }

  let parseToken: any = null;
  const token = req.cookies.get("token");
  const nextAuthToken = req.cookies.get("next-auth.session-token");

  if (token) {
    parseToken = await getDecodedToken(token.value, "token");
  } else if (nextAuthToken) {
    parseToken = await getDecodedToken(nextAuthToken.value, "next-auth");
  }
  

  if (privatePathMatch && !parseToken) {
    return NextResponse.redirect(absoluteURL.toString());
  }

  if(protectedPathMatch && parseToken?.role !== "ADMIN") {
    if(parseToken?.payload.role === "ADMIN") {
      return NextResponse.next();
    }

    return NextResponse.redirect(absoluteURL.toString());
  }
  

  // return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
