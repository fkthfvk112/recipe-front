"use client"

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { revalidateByTagName } from '@/app/(utils)/revalidateServerTag';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { domainId, domainName } from './ReviewContainer';


interface ReviewEtcState{
    reviewId:number,
    canDelete:boolean,
    domainName:domainName
    domainId:domainId,
}

/**신고하기, 글삭제,  */
function ReviewEtcBtnClient({domainId, reviewId, domainName, canDelete}:ReviewEtcState){
    const [open, setOpen] = useState<boolean>(false);
    const outRef = useRef<HTMLDivElement | null>(null);

    console.log("여기 도메이이인", domainName);

    
    const deleteReview = ()=>{
        console.log("딜리트 버튼", reviewId)
        switch(domainName){
            case 'board':
                axiosAuthInstacne
                    .delete(`review/board/delete/${reviewId}`)
                    .then((res)=>{
                        revalidateByTagName(`reviews-${domainId}`)
                    })
            break;
            case 'recipe':
                axiosAuthInstacne
                    .delete(`review/recipe/delete/${reviewId}`)
                    .then((res)=>{
                        revalidateByTagName(`reviews-${domainId}`)
                    })
            break;
        }
       
    }
    
    useEffect(()=>{
        const clickOutside = (e:MouseEvent)=>{
            if(open && outRef.current && !outRef.current.contains(e.target as Node)){
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", clickOutside);

        return ()=>{
            document.removeEventListener("mousedown", clickOutside);
        }
    })

    //have to :: 구현하기
    return (
        <div className="relative">
            <MoreHorizIcon onClick={()=>setOpen(!open)}/>
            {
            open&&
            <div ref={outRef}>
                <div className="absolute flex flex-col justify-center items-start right-0 bg-[#d1d1d1] p-3 w-[150px] z-50">
                    <div className='mt-0.5 mb-0.5 cursor-pointer'>신고하기</div>
                    {canDelete&&<div onClick={deleteReview} className='mt-0.5 mb-0.5 cursor-pointer'>리뷰 삭제</div>}
                </div>
            </div>
            }
        </div>
    )
}

export default React.memo(ReviewEtcBtnClient);