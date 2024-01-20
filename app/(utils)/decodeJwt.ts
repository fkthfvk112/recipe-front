import { jwtDecode } from "jwt-decode";
export interface decodedUserInfo {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

export function decodeUserJwt(jwt: string): decodedUserInfo | undefined {
  if (!jwt.startsWith("Bearer_")) return undefined;
  const tokenString = jwt.slice(7);

  const decodedToken: decodedUserInfo = jwtDecode(tokenString);

  return decodedToken;
}
