"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import serverFetch from "@/app/(commom)/serverFetch";

function BoardHolder({initialData, boardMenuId}:{initialData:IndexPagenation<BoardPreview[], number>, boardMenuId:number}){
    const [data, setData] = useState<BoardPreview[]>(initialData.data);
    const [isEnd, setIsEnd] = useState<boolean>(initialData.isEnd);
    const [pageInx, setPageInx] = useState<number>(initialData.index);
    const [viewRef, inview] = useInView();

    const initialDatas = data?.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    })

    const fetchData = async()=>{
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
        <div className="w-full h-full min-h-lvh p-2">
            {initialDatas}
        </div>
        <div ref={viewRef}></div>
        </>
    )
}

export default React.memo(BoardHolder);