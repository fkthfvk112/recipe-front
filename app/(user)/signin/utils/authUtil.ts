"use server";
import { decodedUserInfo, decodeUserJwt } from "@/app/(utils)/decodeJwt";
import { cookies } from "next/headers";

export async function deleteAuthToken() {
  cookies().delete("mugin-authtoken");
  cookies().delete("mugin-refreshtoken");
}

export async function isLogin(){
  const cookieStore = cookies()
  const auth = cookieStore.get('mugin-authtoken');

  if(cookieStore.has('mugin-authtoken') && auth?.value.startsWith('Bearer_')){
      return true;
  }
  return false;
}


export async function isAdmin():Promise<boolean>{
  const token:decodedUserInfo|undefined = await decodeUserJwt();
  if(token === undefined) return false;

  if(token.roles.includes("ROLE_ADMIN")){
    return true;
  }

  return false;
}