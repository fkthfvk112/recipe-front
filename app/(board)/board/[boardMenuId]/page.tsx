"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardPreview } from "@/app/(type)/board";
import BoardHolder from "./BoardHolder";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import Link from "next/link";
import CreateIcon from '@mui/icons-material/Create';
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { BoardMenu } from "@/app/(type)/menu";
import BoardNav from "./BoardNav";

export default async function Board({
    params
  }: {
    params:{boardMenuId:number};
  }){
    const boardData:IndexPagenation<BoardPreview[], number> = await serverFetch({
        url:"board/previews",
        queryParams:{
            sortingCondition:"REAL_TIME",
            boardMenuId:params.boardMenuId
        },
        option:{
            cache:"no-store",
            next:{
                tags: [`boardmst-${params.boardMenuId}`],
            }
        }
    })

    const baseMenuList:BoardMenu[] = await serverFetch({url:"board-menu/base"});
    const selectedMenu = baseMenuList.find(menu=>Number(menu.boardMenuId) === Number(params.boardMenuId));

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <BoardNav baseMenuList={baseMenuList} selectedMenu={params.boardMenuId}/>
            <TitleDescription title={`${selectedMenu?.menuName}`} desc={`${selectedMenu?.description}`}/>
            <div className="defaultInnerContainer  flex flex-col justify-center items-center w-full min-h-lvh">
                <BoardHolder initialData={boardData} boardMenuId={params.boardMenuId}/>
                <Link href={`/board/${params.boardMenuId}/create`} className="fixed bottom-6 roundRreenBtn">
                    <CreateIcon sx={{width:"25px", height:"25px"}}/>
                    <span className="ms-2">글쓰기</span>
                </Link>
            </div>
         </div>
    )
}