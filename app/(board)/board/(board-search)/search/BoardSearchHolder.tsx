"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import serverFetch from "@/app/(commom)/serverFetch";
import { CircularProgress } from "@mui/material";
import BoardPreviewHoriItem from "@/app/(board)/BoardPreviewHoriItem";

function BoardSearchHolder({searchedData}:{searchedData:string}){
    const [isSearched, setIsSearched] = useState<boolean>(false);//검색 데이터 패칭 한 적 있는지 확인

    const [data, setData]           = useState<BoardPreview[]>([]);
    const [isEnd, setIsEnd]         = useState<boolean>(false);
    const [dateInx, setDateInx]     = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewRef, inview] = useInView();

    const initialDatas = data?.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    })

    const fetchData = async()=>{
        setIsLoading(true);
        const boardData:IndexPagenation<BoardPreview[], string> = await serverFetch({
            url:"board/search-previews/inx-pagination",
            queryParams:{
                sortingCon:"LATEST",
                searchingTerm:searchedData,
                dateInx:dateInx,
                size:5 //have to resize
            },
            option:{
                cache:"no-cache",
            }
        })
        .finally(()=>{
            setIsLoading(false);
            setIsSearched(true);
        })

        setIsEnd(boardData.isEnd);
        setData([...data, ...boardData.data]);
        setDateInx(boardData.index);
    }
    
    useEffect(()=>{
        if(!isEnd && inview && searchedData.length >= 2){
            fetchData();
        }
    }, [inview])

    console.log("히히히,", searchedData)

    return (
        <>
            <ul className="w-full h-full min-h-10 p-2">
                {initialDatas}
                {
                    isSearched&&initialDatas.length === 0&&
                    <div className="flex-center mt-5 mb-5">검색 결과가 존재하지 않습니다.</div>
                }
            </ul>
            <div className="h-10 w-full flex-center" ref={viewRef}>
                {isLoading && <CircularProgress />}
            </div>
        </>
    )
}

export default React.memo(BoardSearchHolder);