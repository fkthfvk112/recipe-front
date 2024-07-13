import TitleDescription from "@/app/(commom)/Component/TitleDescription";

export default function BoardLayout({
    children,
  }: {
    children: React.ReactNode;
  }){

    return (
        <div className="bg-[#FB8500] defaultOuterContainer">
            {children}
         </div>
    )
}