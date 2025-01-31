import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import EditDelClient from "./EditDelClient";

export interface EditDel{
    ownerUserId:string,
    editReturnURl:string,
    delPostUrl:string,
    delReturnUrl:string,
    revalidateTagNames?:string[],
}

export default async function EditDel({ownerUserId, editReturnURl, delPostUrl, delReturnUrl, revalidateTagNames}:EditDel){
    const loginUser:decodedUserInfo|undefined = await decodeUserJwt();
    if(loginUser === undefined) return;
    if(loginUser.sub !== ownerUserId && !loginUser.roles.includes("ROLE_ADMIN")) return;
    return(
        <EditDelClient editReturnURl={editReturnURl} delPostUrl={delPostUrl} delReturnUrl={delReturnUrl} revalidateTagNames={revalidateTagNames}></EditDelClient>
    )
}