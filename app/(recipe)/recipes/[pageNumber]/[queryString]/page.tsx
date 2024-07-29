"use server";

import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import RecipePagination from "../../RecipePagination";
import NoContent_Recipe from "../../(common)/NoContent_Recipe";

export default async function SearchingByCondition({
  params,
}: {
  params: { pageNumber: string; queryString: string };
}) {
  const decodedUrl = decodeURIComponent(params.queryString);

  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?${decodedUrl}&page=${params.pageNumber}`,
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

  const recentRecipes = fetchData && fetchData.length ? (
    fetchData.map((recipe, inx) => (
      <div key={inx} className="m-3">
        <Link href={`/recipe-detail/${recipe.recipeId}`}>
          <RecipeCard recipe={recipe} />
        </Link>
      </div>
    ))
  ) : (
    <NoContent_Recipe />
  );
  

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full min-h-[300px] mb-10">
      <div className="flex flex-wrap justify-center items-center w-full mb-16">
        {recentRecipes}
      </div>
      {
      pnMaxCnt >= 2 &&
      <RecipePagination
        queryStr={decodedUrl}
        pageNow={Number(params.pageNumber)}
        pageMax={pnMaxCnt}
      ></RecipePagination>
      }
    </div>
  );
}
