"use server";
import { decodedUserInfo, decodeUserJwt } from "@/app/(utils)/decodeJwt";
import { cookies } from "next/headers";

export async function deleteAuthToken() {
  cookies().delete("authorization");
  cookies().delete("refresh-token");
}

export async function isLogin(){
  const cookieStore = cookies()
  const auth = cookieStore.get('authorization');

  if(cookieStore.has('authorization') && auth?.value.startsWith('Bearer_')){
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