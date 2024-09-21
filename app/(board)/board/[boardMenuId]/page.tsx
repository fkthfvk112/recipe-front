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

    const baseMenuList:BoardMenu[] = await serverFetch({
        url:"board-menu/base",
        option:{
            next:{
                revalidate:3600,
            }
        }
    },);
    const selectedMenu = baseMenuList.find(menu=>Number(menu.boardMenuId) === Number(params.boardMenuId));

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <BoardNav baseMenuList={baseMenuList} selectedMenu={params.boardMenuId}/>
            <TitleDescription title={`${selectedMenu?.menuName}`} desc={`${selectedMenu?.description}`}/>
            <div className="defaultInnerContainer  flex flex-col justify-start items-center w-full min-h-lvh">
                <BoardHolder boardMenuId={params.boardMenuId} />
                <WriteBtn boardMenuId={params.boardMenuId.toString()} />
            </div>
         </div>
    )
}