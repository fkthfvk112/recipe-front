"use client"

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { revalidateByTagName } from '@/app/(utils)/revalidateServerTag';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useRef, useState } from 'react';
import { domainId, domainName } from './ReviewContainer';
import Swal from 'sweetalert2';
import ReportPostClient from '@/app/(commom)/Component/(report)/ReportPostClient';
import { DomainType } from '@/app/(commom)/Component/(report)/ReportPost';


interface ReviewEtcState{
    reviewId:number,
    canDelete:boolean,
    domainName:domainName
    domainId:domainId,
}

/**신고하기, 글삭제,  */
function ReviewEtcBtnClient({domainId, reviewId, domainName, canDelete}:ReviewEtcState){
    const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);//영역 바깥 클릭시 닫히는 문제 해결 플래그

    const [domainType, setDomainType] = useState<DomainType>();
    const [open, setOpen] = useState<boolean>(false);
    const outRef = useRef<HTMLDivElement | null>(null);


    useEffect(()=>{
        switch (domainName){
            case "board":
                setDomainType(DomainType.BoardReview);
                break;
            case "recipe":
                setDomainType(DomainType.RecipeReview);
                break;
        }
    }, [])
   
    const deleteReview = ()=>{
        Swal.fire({
            title: "삭제하시겠습니까?",
            text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                switch(domainName){
                    case 'board':
                        axiosAuthInstacne
                            .delete(`review/board/delete/${reviewId}`)
                            .then((res)=>{
                                Swal.fire({
                                    title: "삭제 완료",
                                    icon: "success",
                                });
                                revalidateByTagName(`reviews-${domainId}-${domainName}`)
                            })
                    break;
                    case 'recipe':
                        axiosAuthInstacne
                            .delete(`review/recipe/delete/${reviewId}`)
                            .then((res)=>{
                                revalidateByTagName(`reviews-${domainId}-${domainName}`)
                            })
                    break;
                }
            }
        });
    }
    
    useEffect(()=>{
        const clickOutside = (e:MouseEvent)=>{
            if(open && outRef.current && !outRef.current.contains(e.target as Node)){
                if(reportModalOpen) return;
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
                <div className="absolute flex flex-col justify-center items-start right-0 bg-[#ebebeb] p-3 w-[150px] z-50">
                    <div onClick={()=>setReportModalOpen(true)} className='flex justify-start items-center'>
                        <ReportPostClient domainType={domainType} domainId={domainId} etcText={"신고하기"} modalCancelCallback={()=>setReportModalOpen(false)} />
                    </div>
                    
                    {canDelete&&
                    <div onClick={deleteReview} className='mt-0.5 mb-0.5 cursor-pointer'>
                        <DeleteIcon className='hover-pointer m-2'/>
                        리뷰 삭제
                    </div>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default React.memo(ReviewEtcBtnClient);