"use server"
import React from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import { ReviewEtcBtnClient } from "./ReviewEtcBtnClient";

interface ReviewEtcProp{
    reviewId:number,
    reviewOwnerId:string,
}

/**신고하기, 글삭제,  */
export default async function ReviewEtcBtn({reviewId, reviewOwnerId}:ReviewEtcProp){
    const loginUser:decodedUserInfo|undefined = await decodeUserJwt();
    if(loginUser === undefined) return; //로그인 안했을 시 랜더링 X

    return (
        <div className="relative ms-2 me-2">
            <ReviewEtcBtnClient reviewId={reviewId} canDelete={loginUser.sub === reviewOwnerId}/>
        </div>
    )
}

