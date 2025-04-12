export type decodedToken = "token" | "next-auth";

export interface IPagination {
  page: number;
  size: number;
  totalPages: number;
}

export interface IResponseAPI<T> {
  code: number;
  message: string;
  data: T;
}

export interface IJWTDecoded {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}
