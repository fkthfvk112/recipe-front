"use server"

import axios from 'axios';
//use in server component
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export interface authFetchOptions{
    method?:'GET'|'POST'|'PUT'|'DELETE',
    data?:object,
    returnUrl?:string
}

export const authFetch = async(url:string, options?:authFetchOptions)=>{
    const cookieStore = cookies()
    const authCookie = cookieStore.get('authorization')
    const refreshCookie = cookieStore.get('refresh-token');

    if (authCookie === undefined) {
        return;//로그인 X
    }
    if(refreshCookie === undefined){
        return//로그인X
    }

    const fetchData = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            credentials:"include",
            cache: "no-cache",
            headers:{
                Cookie:`${authCookie.name}=${authCookie.value};${refreshCookie.name}=${refreshCookie.value};`
            },
        }
      );

    if (!fetchData.ok) {
        console.log("RecipeDetail fetch error!!", fetchData.status);
        if (options?.returnUrl !== undefined) {
          redirect("/");
        }
        return null;
      }

    const headers = fetchData.headers;
    const cookieHeader = headers.get('Set-Cookie');
    const contentType = headers.get('content-type');

    console.log("타입", contentType);

    if(contentType?.startsWith("text/plain")){
      const responseText = await fetchData.text();

      if(responseText === "Issue new token success" ){
        console.log("Access cookie expired set new cookie success");

        const refetchData = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${url}`,
            {
                credentials: "include",
                cache: "no-cache",
                headers:{
                    Cookie:`${cookieHeader};`
                },
            }
          );

          if (!refetchData.ok) {
            console.log("RecipeDetail fetch error!!", refetchData.status);
            if (options?.returnUrl !== undefined) {
              redirect("/");
            }
            return null;
          }

          const reheaders = refetchData.headers;
          const recontentType = reheaders.get('content-type');
          console.log("타입2", recontentType);

          if(recontentType?.startsWith("text/plain")) return await refetchData.text();
          else return await refetchData.json();
      }
      else{
        return responseText;
      }
    }
    return await fetchData.json();
}