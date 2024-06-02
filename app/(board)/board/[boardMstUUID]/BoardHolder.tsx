"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";
import serverFetch from "@/app/(commom)/serverFetch";

function BoardHolder({initialData, mstUUID}:{initialData:IndexPagenation<BoardPreview[], number>, mstUUID:string}){
    const [data, setData] = useState<BoardPreview[]>(initialData.data);
    const [isEnd, setIsEnd] = useState<boolean>(initialData.isEnd);
    const [pageInx, setPageInx] = useState<number>(initialData.index);
    const [viewRef, inview] = useInView();

    const initialDatas = data?.map((ele)=>{
        return <BoardPreviewHoriItem boardPreview={ele}/>
    })

    const fetchData = async()=>{
        const boardData:IndexPagenation<BoardPreview[], number> = await serverFetch({
            url:"board/previews",
            queryParams:{
                sortingCondition:"REAL_TIME",
                boardMstUUID:mstUUID,
                inx:pageInx
            },
            option:{
                cache:"no-cache",
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