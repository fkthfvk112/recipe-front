"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import serverFetch from "@/app/(commom)/serverFetch";
import { CircularProgress } from "@mui/material";

function BoardHolder({initialData, boardMenuId}:{initialData:IndexPagenation<BoardPreview[], string>, boardMenuId:number}){
    const [data, setData]           = useState<BoardPreview[]>(initialData.data);
    const [isEnd, setIsEnd]         = useState<boolean>(initialData.isEnd);
    const [dateInx, setDateInx]     = useState<string>(initialData.index);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewRef, inview] = useInView();

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
                size:5 //have to resize
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
        setDateInx(boardData.index);
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
        <div className="h-10" ref={viewRef}>
            {isLoading && <CircularProgress />}
        </div>
        </>
    )
}

export default React.memo(BoardHolder);