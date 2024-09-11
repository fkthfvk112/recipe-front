"use client"

import React, { useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import { CircularProgress } from "@mui/material";
import useScrollPosition from "@/app/(commom)/Hook/useScrollPosition";
import { useBoardInxPagenation } from "@/app/(commom)/Hook/useBoardInxPagenation";
import { useRecoilState } from "recoil";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { cacheKey } from "@/app/(recoil)/boardCacheSelector";

function BoardHolder({boardMenuId}:{boardMenuId:number}){
    const [boardData, boardRefetcher, isLoading] = useBoardInxPagenation({boardMenuId});
    const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.board_key + boardMenuId));

    const [viewRef, inview] = useInView();
    const {scrollY} = useScrollPosition();

    const boardPreviews = boardData.cachedData.data.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    });


    useEffect(()=>{
        if(isLoading) return;
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
            <ul className="w-full h-full min-h-lvh p-2">
                {boardPreviews}
            </ul>
            <div className="h-10" ref={viewRef}>
                {isLoading && <CircularProgress />}
            </div>
        </>
    )
}

export default React.memo(BoardHolder);