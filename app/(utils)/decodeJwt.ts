"use server";
import { jwtDecode } from "jwt-decode";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export interface decodedUserInfo {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

export async function decodeUserJwt(): Promise<decodedUserInfo | undefined> {
  const jwt: RequestCookie | undefined = cookies().get("Authorization");
  if (jwt === undefined) return undefined;
  const jwtString = jwt.value;
  if (!jwtString.startsWith("Bearer_")) return undefined;
  const tokenString = jwtString.slice(7);

  const decodedToken: decodedUserInfo = jwtDecode(tokenString);

  return decodedToken;
}
