"use client"

import React, { useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import { CircularProgress } from "@mui/material";
import useScrollPosition from "@/app/(commom)/Hook/useScrollPosition";
import { useBoardInxPagenation } from "@/app/(commom)/Hook/useBoardInxPagenation";
import { useRecoilState } from "recoil";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { BoardIdEnum } from "@/app/(type)/board";
import Swal from "sweetalert2";


function BoardHolder({boardMenuId}:{boardMenuId:number}){
    const [boardData, boardRefetcher, isLoading] = useBoardInxPagenation({boardMenuId});
    const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.board_key + boardMenuId));

    const [viewRef, inview] = useInView();
    const {scrollY} = useScrollPosition();

    const boardPreviews = boardData.cachedData.data.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    });

    const noContent = <li className="w-full min-h-[150px] text-xl flex justify-center items-center">아직 게시글이 없어요😢 첫 게시글을 작성해보세요.</li>

    useEffect(()=>{
        if(isLoading) return;
        if(!isLoading){
            if(boardMenuId == BoardIdEnum.greetBoard){
                const storage = globalThis?.sessionStorage;
                const firstSignUp = storage.getItem("firstSignUp") as string;
                if (typeof firstSignUp === "string") {
                    if(firstSignUp == "true"){
                        Swal.fire({
                            title:"너무 환영해요!!",
                            text:"오른쪽 아래 초록 버튼을 눌러 첫 인사를 작성해보세요",
                            icon: "success",
                        })
                    }
                    storage.removeItem("firstSignUp");
                }
            }
        }
        if(inview){
            boardRefetcher();
        }
    }, [inview, isLoading])

    useEffect(()=>{
        if(cachedScrollY){
            window.scrollTo({
                top: cachedScrollY
            });
        }
        return()=>{
            setScrollYCache(scrollY);
        }
    }, [])

    return (
        <>
            <ul className="w-full h-full min-h-[300px] p-2">
                {!isLoading && boardPreviews?.length <= 0 ? noContent : boardPreviews}
            </ul>
            <div className="h-10" ref={viewRef}>
                {isLoading && <CircularProgress />}
            </div>
        </>
    )
}

export default React.memo(BoardHolder);