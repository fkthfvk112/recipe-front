"use server";
import { decodedUserInfo, decodeUserJwt } from "@/app/(utils)/decodeJwt";
import { cookies } from "next/headers";

export async function deleteAuthToken() {
  const domain = process.env.NODE_ENV === 'development' ? 'localhost' : 'mug-in.com';

  cookies().delete({
    name:"mugin-refreshtoken",
    domain:domain,
    path:"/"
  })

  cookies().delete({
    name:"mugin-authtoken",
    domain:domain,
    path:"/"
  })
}

export async function isLogin(){
  const cookieStore = cookies()
  //const auth = cookieStore.get('mugin-refreshtoken');

  if(cookieStore.has('mugin-refreshtoken')){
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