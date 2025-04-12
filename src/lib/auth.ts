import jwt from "jsonwebtoken";
import { decode } from "next-auth/jwt";
import { jwtVerify } from "jose";
import { decodedToken } from "./index.model";

const SECRET_KEY = process.env.NEXTAUTH_SECRET!;
const SECRET_KEY_JOSE = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "7d" });
}

export const verifyToken = (token: string) => {
  try {
    return jwtVerify(token, SECRET_KEY_JOSE);
  } catch (error) {
    return console.log(error);
  }
};

export async function getDecodedToken(token?: string, type?: decodedToken) {
  try {
    if (!token) return null;
    switch (type) {
      case "token":
       return await verifyToken(token);
      case "next-auth":
        return await decode({
          token,
          secret: SECRET_KEY,
        });
      default:
        return null;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
