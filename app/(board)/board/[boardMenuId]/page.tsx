"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardPreview } from "@/app/(type)/board";
import BoardHolder from "./BoardHolder";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { BoardMenu } from "@/app/(type)/menu";
import BoardNav from "./BoardNav";
import WriteBtn from "./WriteBtn";

export default async function Board({
    params
  }: {
    params:{boardMenuId:number};
  }){
    const boardData:IndexPagenation<BoardPreview[], string> = await serverFetch({
        url:"board/previews/inx-pagination",
        queryParams:{
            sortingCon:"LATEST",
            boardMenuId:params.boardMenuId,
            dateInx:"",
            size:10
        },
        option:{
            next:{
                revalidate: 60,
                tags: [`boardMenu-${params.boardMenuId}`],
            }
        }
    })

    const baseMenuList:BoardMenu[] = await serverFetch({
        url:"board-menu/base",
        option:{
            next:{
                revalidate:3600,
            }
        }
    },);
    const selectedMenu = baseMenuList.find(menu=>Number(menu.boardMenuId) === Number(params.boardMenuId));

    console.log("랜더링")
    const isDataLoaded = !!boardData && baseMenuList !== undefined;

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <BoardNav baseMenuList={baseMenuList} selectedMenu={params.boardMenuId}/>
            <TitleDescription title={`${selectedMenu?.menuName}`} desc={`${selectedMenu?.description}`}/>
            <div className="defaultInnerContainer  flex flex-col justify-center items-center w-full min-h-lvh">
            {isDataLoaded && <BoardHolder initialData={boardData} boardMenuId={params.boardMenuId} />}
            <WriteBtn boardMenuId={params.boardMenuId.toString()} />
            </div>
         </div>
    )
}