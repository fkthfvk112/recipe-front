"use server";

import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import RecipePagination from "../../RecipePagination";
import NoContent_Recipe from "../../(common)/NoContent_Recipe";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

  //let recipeDetail: RecipeDetail = fetchData.recipeDTO;
  return {
    title: "레시피 검색 - 머그인",
    description:"입맛에 맞는 다양한 레시피를 검색해보세요.",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: "레시피 검색 - 머그인",
      description:"입맛에 맞는 다양한 레시피를 검색해보세요.",
    }
  }
}

export default async function SearchingByCondition({
  params,
}: {
  params: { pageNumber: string; queryString: string };
}) {
  const decodedUrl = decodeURIComponent(params.queryString);
  
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?${decodedUrl}&page=${params.pageNumber}`,
    {
      cache: "default",
      next: {
        tags: [`reviews-find`],
      },
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
    } else {
      return res.json();
    }
  });
    
  //페이지 총 개수
  const pageMaxCnt: number = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions/cnt?${decodedUrl}`,
    {
      cache: "no-cache", //수정
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
    } else {
      return res.json();
    }
  });

  const pnMaxCnt = Math.floor(
    pageMaxCnt % 10 === 0 ? pageMaxCnt / 10 : pageMaxCnt / 10 + 1
  );

  const recentRecipes = fetchData &&
    fetchData.map((recipe, inx) => (
      <div key={inx}>
        <Link href={`/recipe-detail/${recipe.recipeId}`}>
          <RecipeCard recipe={recipe} />
        </Link>
      </div>
    ))


  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full min-h-[300px] mb-10">
      <div className="grid media-gridcol-3-to-2 w-full gap-3">
        {recentRecipes}
      </div>
      {
        fetchData?.length <= 0 && <NoContent_Recipe />
      }
      {
        pnMaxCnt >= 1 &&
        <RecipePagination
          queryStr={decodedUrl}
          pageNow={Number(params.pageNumber)}
          pageMax={pnMaxCnt}
        ></RecipePagination>
      }
    </div>
  );
}
