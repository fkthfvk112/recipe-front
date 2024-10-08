"use server"

import serverFetch from "@/app/(commom)/serverFetch"
import { BoardPreview } from "@/app/(type)/board"
import BoardPreviewHoriItem from "../BoardPreviewHoriItem"

export default async function RealTimeLikeBoard(){

    const boardData:BoardPreview[] = await serverFetch({
        url:"board/previews/popular",
        queryParams:{size:3},
        option:{
            cache:"no-cache",
        }
    }).catch((e)=>{
        console.log(e);
    })

    const borardDatasProp = boardData?.map((ele, inx)=>{
        return <BoardPreviewHoriItem key={inx} boardPreview={ele}/>
    })

    return (
        <ul className="w-full max-w-5xl p-5 min-h-44 mt-12 mb-12 bg-[#FB8500] rounded-2xl">
            <h1 className="text-2xl mb-10">인기 게시글</h1>
            {borardDatasProp}
        </ul>
    )
}