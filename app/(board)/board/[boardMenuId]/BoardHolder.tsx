"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import serverFetch from "@/app/(commom)/serverFetch";
import { CircularProgress } from "@mui/material";

function BoardHolder({initialData, boardMenuId}:{initialData:IndexPagenation<BoardPreview[], number>, boardMenuId:number}){
    const [data, setData]           = useState<BoardPreview[]>(initialData.data);
    const [isEnd, setIsEnd]         = useState<boolean>(initialData.isEnd);
    const [pageInx, setPageInx]     = useState<number>(initialData.index);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewRef, inview] = useInView();

    const initialDatas = data?.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    })

    const fetchData = async()=>{
        setIsLoading(true);
        const boardData:IndexPagenation<BoardPreview[], number> = await serverFetch({
            url:"board/previews",
            queryParams:{
                sortingCondition:"REAL_TIME",
                boardMenuId:boardMenuId,
                inx:pageInx
            },
            option:{
                cache:"no-cache",
                next:{
                    tags: [`boardmst-${boardMenuId}`],
                }
            }
        })
        .finally(()=>{
            setIsLoading(false);
        })

        setIsEnd(boardData.isEnd);
        setData([...data, ...boardData.data]);
        setPageInx(boardData.index);
    }
    
    useEffect(()=>{
        if(!isEnd && inview){
            fetchData();
        }
    }, [inview])

    return (
        <>
        <ul className="w-full h-full min-h-lvh p-2">
            {initialDatas}
        </ul>
        <div ref={viewRef}>
            {isLoading && <CircularProgress />}
        </div>
        </>
    )
}

export default React.memo(BoardHolder);