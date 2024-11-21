"use client"

import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import RecipeSearchBar from "./(common)/RecipeSearchBar";
import { AdditionalBtn } from "@/app/(commom)/Component/AdditionalBtn";

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {layoutMargin} = useResponsiveDesignCss();

  return (
    <div className="defaultOuterContainer bg-white">
      <RecipeSearchBar></RecipeSearchBar>
      <div className="flex justify-center w-full h-full max-w-[1024px] p-2 mt-10">
        {children}
        <AdditionalBtn additionalBtns={[{name:"레시피 작성", url:"/create-recipe"}]}/>
      </div>
    </div>
  );
}
