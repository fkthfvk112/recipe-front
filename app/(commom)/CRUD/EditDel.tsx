"use server"
import { Jwt } from "@/app/(type)/user";
import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import EditDelClient from "./EditDelClient";

export default async function EditDel({ownerUserId, editReturnURl, delPostUrl, delReturnUrl}:{ownerUserId:string, editReturnURl:string, delPostUrl:string, delReturnUrl:string}){
    const loginUser:decodedUserInfo|undefined = await decodeUserJwt();
    if(loginUser === undefined) return;
    if(loginUser.sub !== ownerUserId) return;

    return(
        <EditDelClient editReturnURl={editReturnURl} delPostUrl={delPostUrl} delReturnUrl={delReturnUrl}></EditDelClient>
    )
}