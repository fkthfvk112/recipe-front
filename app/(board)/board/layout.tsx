import TitleDescription from "@/app/(commom)/Component/TitleDescription";

export default function BoardLayout({
    children,
  }: {
    children: React.ReactNode;
  }){

    return (
        <div className="bg-[#FB8500] defaultOuterContainer">
            <TitleDescription title="자유게시판" desc="무엇이든 원하는 걸 말하는 게시판! 자유 게시판!"/>
            <section className="defaultInnerContainer">
                {children}
            </section>
         </div>
    )
}