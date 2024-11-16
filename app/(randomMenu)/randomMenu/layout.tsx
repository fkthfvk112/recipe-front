import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    //let recipeDetail: RecipeDetail = fetchData.recipeDTO;
    return {
      title: "랜덤 메뉴 추천 - 머그인",
      description:"무엇을 먹을지 고민이신가요? 메뉴를 선택하고 무엇을 먹을까? 버튼을 눌러 보세요. 다양한 메뉴 추천을 도와줄게요.",
      icons:{
        icon:"/common/favicon.png"
      },
      openGraph:{
        title: "랜덤 메뉴 추천 - 머그인",
        description:"무엇을 먹을지 고민이신가요? 메뉴를 선택하고 무엇을 먹을까? 버튼을 눌러 보세요. 다양한 메뉴 추천을 도와줄게요."
      }
    }
  }

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="defaultInnerContainer-noPTop">
      {children}
    </main>
  );
}
