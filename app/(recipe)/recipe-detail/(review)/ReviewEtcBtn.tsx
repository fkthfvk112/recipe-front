"use server"
import React from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import { domainId, domainName } from "./ReviewContainer";
import ReviewEtcBtnClient from "./ReviewEtcBtnClient";

interface ReviewEtcProp{
    reviewId:number,
    reviewOwnerId:string,
    domainId:domainId,//for revalidate data
    domainName:domainName
    isDel:boolean,
}

/**신고하기, 글삭제,  */
export default async function ReviewEtcBtn({reviewId, reviewOwnerId, domainId, domainName, isDel}:ReviewEtcProp){
    if(isDel) return; //삭제된 경우 랜더링 X
    const loginUser:decodedUserInfo|undefined = await decodeUserJwt();
    if(loginUser === undefined) return; //로그인 안했을 시 랜더링 X

    const canDel = loginUser.sub === reviewOwnerId || loginUser.roles.includes("ROLE_ADMIN");
    return (
        <div className="relative ms-2 me-2">
            <ReviewEtcBtnClient domainId={domainId} reviewId={reviewId} reviewOwnerId={reviewOwnerId} domainName={domainName} canDelete={canDel}/>
        </div>
    )
}

