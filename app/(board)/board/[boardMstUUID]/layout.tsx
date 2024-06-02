import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import BoardNav from "./BoardNav";

export default function BoardLayout({
    children,
    params
  }: {
    children: React.ReactNode;
    params:{boardMstUUID:string};
  }){

    return (
        <div className="bg-[#FB8500] defaultOuterContainer">
            <BoardNav boardMstUUID={params.boardMstUUID}/>
            <TitleDescription title="자유게시판" desc="무엇이든 원하는 걸 말하는 게시판! 자유 게시판!"/>
            <section className="defaultInnerContainer min-h-lvh">
                {children}
            </section>
         </div>
    )
}