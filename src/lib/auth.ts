import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

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
}
