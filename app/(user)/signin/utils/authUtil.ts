"use server";
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
