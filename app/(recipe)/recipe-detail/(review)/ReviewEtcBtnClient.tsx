"use client"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useRef, useState } from 'react';


interface ReviewEtcState{
    reviewId:number,
    canDelete:boolean,
}

/**신고하기, 글삭제,  */
export  function ReviewEtcBtnClient({reviewId, canDelete}:ReviewEtcState){
    const [open, setOpen] = useState<boolean>(false);
    const outRef = useRef<HTMLDivElement | null>(null);

    const deleteReview = ()=>{

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
                    {canDelete&&<div className='mt-0.5 mb-0.5 cursor-pointer'>리뷰 삭제</div>}
                </div>
            </div>
            }
        </div>
    )
}