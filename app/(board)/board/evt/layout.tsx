import serverFetch from "@/app/(commom)/serverFetch";
import { BoardMenu } from "@/app/(type)/menu";

export default async function BoardLayout({
    children,
  }: {
    children: React.ReactNode;
  }){
    return (
      <main className={`defaultOuterContainer flex pb-20`}>
          {children}
      </main>
    )
}