"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import BoardHolder from "./BoardHolder";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { BoardMenu } from "@/app/(type)/menu";
import BoardNav from "./BoardNav";
import { Metadata, ResolvingMetadata } from "next";
import { AdditionalBtn } from "@/app/(commom)/Component/AdditionalBtn";

type Props = {
    params: Promise<{ boardMenuId: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const boardMenuId = (await params).boardMenuId

    const baseMenuList:BoardMenu[] = await serverFetch({
        url:"board-menu/base",
        option:{
            next:{
                revalidate:3600,
            }
        }
    },);

    const boardInfo = baseMenuList.find(ele=>`${ele.boardMenuId}` === boardMenuId);
    const boardTitle = boardInfo?.menuName || "게시판";
    const boardDesc = boardInfo?.description || "다양한 의견을 공유하는 게시판이에요. 여러 유저들과 다양한 의견을 나눠보세요."
return {
    title: `${boardTitle} - 머그인`,
    description:boardDesc,
    icons:{
    icon:"/common/favicon.png"
    },
    openGraph:{
    title:`${boardTitle} - 머그인`,
    description:boardDesc,
    images:"/common/logo.png"
    }
}
}

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
                <AdditionalBtn additionalBtns={[{name:"글쓰기", url:`/board/${params.boardMenuId.toString()}/create`}]}/>
            </div>
         </div>
    )
}