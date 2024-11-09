import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
      title: "머그인 - 냉장고",
      description:"냉장고, 찬장에 남아있는 식재료를 관리해요. 냉장고, 김치냉장고, 찬장 등 다양한 위치의 식재료의 유통기한을 관리하고 냉장고 속 재료로 만들 수 있는 레시피를 추천해줘요.",
      icons:{
        icon:"/common/favicon.png"
      },
      openGraph:{
        title: "머그인 - 냉장고",
        description:"냉장고, 찬장에 남아있는 식재료를 관리해요. 냉장고, 김치냉장고, 찬장 등 다양한 위치의 식재료의 유통기한을 관리하고 냉장고 속 재료로 만들 수 있는 레시피를 추천해줘요.",
        }
    }
  }
   

export default function fridgeLayout({
    children
}:{
    children: React.ReactNode;
}){
    return (
        <div className="defaultOuterContainer flex flex-col justify-start items-center">
            {children}
        </div>
    )
}