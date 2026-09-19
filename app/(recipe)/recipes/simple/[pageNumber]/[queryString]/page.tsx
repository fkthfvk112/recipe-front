"use server";

import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import RecipePagination from "../../../RecipePagination";
import NoContent_Recipe from "../../../(common)/NoContent_Recipe";
import { Metadata } from "next";
import { getRecipeDetailUrl } from "@/app/(utils)/slugUtil";

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

  const [fetchData, pageMaxCnt] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/searchingTerm?${decodedUrl}&page=${params.pageNumber}`,
      {
        next: { revalidate: 30 },
      }
    )
      .then((res) => (res.ok ? res.json() : []))
      .catch((err) => {
        console.error("Simple recipe list fetch error:", err);
        return [];
      }),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/searchingTerm/cnt?${decodedUrl}`,
      {
        next: { revalidate: 30 },
      }
    )
      .then((res) => (res.ok ? res.json() : 0))
      .catch((err) => {
        console.error("Simple recipe count fetch error:", err);
        return 0;
      }),
  ]);

  const pnMaxCnt = Math.floor(
    pageMaxCnt % 10 === 0 ? pageMaxCnt / 10 : pageMaxCnt / 10 + 1
  );

  const recentRecipes = fetchData &&
    fetchData.map((recipe: Recipe, inx: number) => (
      <div key={inx}>
        <Link href={getRecipeDetailUrl(recipe.recipeId, recipe.recipeName)} prefetch={false}>
          <RecipeCard recipe={recipe} />
        </Link>
      </div>
    ))

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full min-h-[300px] mb-10 px-4 sm:px-0">
      <div className="grid media-gridcol-3-to-2 w-full gap-4 sm:gap-6 py-4">
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
