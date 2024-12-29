import serverFetch from "@/app/(commom)/serverFetch";
import { BoardMenu } from "@/app/(type)/menu";
import { deleteCookie, getCookie } from 'cookies-next';

export default async function BoardLayout({
    children,
    params
  }: {
    children: React.ReactNode;
    params:{boardMenuId:number};
  }){
    const baseMenuList:BoardMenu[] = await serverFetch({url:"board-menu/base"});
    const selectedMenu = baseMenuList.find(menu=>Number(menu.boardMenuId) === Number(params.boardMenuId));
    return (
      <main className={`bg-[${selectedMenu?.themeColor}] defaultOuterContainer flex pb-20`}>
          {children}
      </main>
    )
}