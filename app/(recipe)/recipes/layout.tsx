"use client"

import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import SearchBar from "@/app/SearchBar";
import CreateIcon from '@mui/icons-material/Create';
import Link from "next/link";
import RecipeSearchBar from "./(common)/RecipeSearchBar";

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {layoutMargin} = useResponsiveDesignCss();

  return (
    <div className="defaultOuterContainer bg-white">
      <RecipeSearchBar></RecipeSearchBar>
      <div className="w-full h-full max-w-[1024px] p-2 mt-10">
        {children}
        <Link href={`/create-recipe`} className={`fixed bottom-6 right-12 roundRreenBtn ${layoutMargin} z-10`}>
          <CreateIcon sx={{width:"25px", height:"25px"}}/>
          <span className="ms-2">레시피 작성</span>
        </Link>
      </div>
    </div>
  );
}
