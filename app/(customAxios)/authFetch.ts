"use server"

//use in server component
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export interface authFetchOptions{
    'Content-Type':string,
    method?:'GET'|'POST'|'PUT'|'DELETE',
    data?:object,
    returnUrl?:string
}

export const authFetch = async(url:string, options?:authFetchOptions)=>{
    const cookieStore = cookies()
    const authCookie = cookieStore.get('authorization')
    const refreshCookie = cookieStore.get('refresh-token');
    const initialContentType = options?.['Content-Type'] || 'application/json';


    if (authCookie === undefined) {
        return;//로그인 X
    }
    if(refreshCookie === undefined){
        return//로그인X
    }

    const fetchData = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
          ...options,
          credentials:"include",
          cache: "no-cache",
          headers:{
            "Content-Type":initialContentType,
            Cookie:`${authCookie.name}=${authCookie.value};${refreshCookie.name}=${refreshCookie.value};`
          },
        }
      );

    if (!fetchData.ok) {
        console.log("RecipeDetail fetch error!!", fetchData.status);
        if (options?.returnUrl !== undefined) {
          redirect("/");
        }
        else if(options?.returnUrl){
          redirect(options.returnUrl);
        }
        return null;
      }
      
    const headers = fetchData.headers;
    const cookieHeader = headers.get('Set-Cookie');
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
          else if(options?.returnUrl){
            redirect(options.returnUrl);
          }
          return null;
        }
        const reheaders = refetchData.headers;
        const recontentType = reheaders.get('content-type');
        if(recontentType?.startsWith("text/plain")){
          return await refetchData.text();
        }
        else return await refetchData.json();
    }
    else{
      if(IsJsonString(responseText)){
        return JSON.parse(responseText);
      }
      return responseText;
    }
}

function IsJsonString(str:string) {
  try {
    var json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}