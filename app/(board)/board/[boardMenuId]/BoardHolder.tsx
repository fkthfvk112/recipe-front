"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import serverFetch from "@/app/(commom)/serverFetch";
import { CircularProgress } from "@mui/material";
import useScrollPosition from "@/app/(commom)/Hook/useScrollPosition";
import { useRecoilState, useResetRecoilState } from "recoil";
import { boardCacheSelectorAtom, cacheKey } from "@/app/(recoil)/boardCacheSelector";

function BoardHolder({initialData, boardMenuId}:{initialData:IndexPagenation<BoardPreview[], string>, boardMenuId:number}){
    const [isInitial, setIsInitial] = useState<boolean>(true);

    const [data, setData]           = useState<BoardPreview[]>(initialData.data);
    const [isEnd, setIsEnd]         = useState<boolean>(initialData.isEnd);
    const [dateInx, setDateInx]     = useState<string>(initialData.index);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewRef, inview] = useInView();
    const {scrollY} = useScrollPosition();
    const [boardCache, setBoardCache] = useRecoilState(boardCacheSelectorAtom(cacheKey.board_key + boardMenuId));
    const resetBoardCache = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + boardMenuId));

    const initialDatas = data?.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    })

    const fetchData = async()=>{
        setIsLoading(true);
        const boardData:IndexPagenation<BoardPreview[], string> = await serverFetch({
            url:"board/previews/inx-pagination",
            queryParams:{
                sortingCon:"LATEST",
                boardMenuId:boardMenuId,
                dateInx:dateInx,
                size:10
            },
            option:{
                next:{
                    revalidate: 60,
                    tags: [`boardMenu-${boardMenuId}`],
                }
            }
        })
        .finally(()=>{
            setIsLoading(false);
        })

        setIsEnd(boardData.isEnd);
        setData([...data, ...boardData.data]);
        setDateInx(boardData.index);
    }

    useEffect(()=>{
        if(isLoading) return;
        if(isInitial){
            if(boardCache?.cachedData && boardCache.cachedData.data.length >= 1){             
                setData(boardCache.cachedData.data)
                setDateInx(boardCache.cachedData.dateInx);
                setIsEnd(boardCache.cachedData.isEnd);
                window.scrollTo({
                    top:boardCache.cachedData.scrollY,
                })

            }else{
                fetchData();
            }
            setIsInitial(false);
        }else{
            if(!isEnd && inview && !isLoading){
                fetchData();
            }
        }
    }, [inview, isLoading])


    useEffect(()=>{
        return()=>{
            setBoardCache({
                cacheId:cacheKey.board_key + boardMenuId,
                cachedData:{
                    data:data,
                    dateInx:dateInx,
                    isEnd:isEnd,
                    scrollY:scrollY
              }
            })
          }
    }, [])

    return (
        <>
            <ul className="w-full h-full min-h-lvh p-2">
                {initialDatas}
            </ul>
            <div className="h-10" ref={viewRef}>
                {isLoading && <CircularProgress />}
            </div>
        </>
    )
}

export default React.memo(BoardHolder);