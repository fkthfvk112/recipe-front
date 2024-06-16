"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardPreview } from "@/app/(type)/board";
import BoardHolder from "./BoardHolder";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import Link from "next/link";
import CreateIcon from '@mui/icons-material/Create';

export default async function Board({
    params
  }: {
    params:{boardMstUUID:string};
  }){
    const boardData:IndexPagenation<BoardPreview[], number> = await serverFetch({
        url:"board/previews",
        queryParams:{
            sortingCondition:"REAL_TIME",
            boardMstUUID:params.boardMstUUID
        },
        option:{
            cache:"no-store",
            next:{
                tags: [`boardmst-${params.boardMstUUID}`],
            }
        }
    })

    console.log("보더 데이터", boardData);

    return (
        <div className="relative flex justify-center">
            <BoardHolder initialData={boardData} mstUUID={params.boardMstUUID}/>
            <Link href={`/board/create/${params.boardMstUUID}`} className="fixed bottom-6 roundRreenBtn">
                <CreateIcon sx={{width:"25px", height:"25px"}}/>
                <span className="ms-2">글쓰기</span>
            </Link>
         </div>
    )
}