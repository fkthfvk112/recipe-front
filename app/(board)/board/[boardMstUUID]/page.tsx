"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardPreview } from "@/app/(type)/board";
import AddIcon from '@mui/icons-material/Add';
import BoardHolder from "./BoardHolder";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import Link from "next/link";

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
            cache:"no-cache",
        }
    })

    console.log("하하하", params.boardMstUUID);

    return (
        <div className="relative">
            <BoardHolder initialData={boardData} mstUUID={params.boardMstUUID}/>
            <Link href={`/board/create/${params.boardMstUUID}`} className="fixed right-8 bottom-6 roundRreenBtn">
                <AddIcon sx={{width:"50px", height:"50px"}}/>
            </Link>
         </div>
    )
}