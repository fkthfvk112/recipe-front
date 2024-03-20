"use server";

import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { searchPage } from "@/app/(recoil)/recoilAtom";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import RecipePagination from "../../RecipePagination";

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

  //페이지 개수 콜
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

  console.log("넘버", pageMaxCnt);

  const pnMaxCnt = Math.floor(
    pageMaxCnt % 10 === 0 ? pageMaxCnt / 10 : pageMaxCnt / 10 + 1
  );

  const recentRecipes = fetchData?.map((recipe, inx) => (
    <div key={inx} className="m-3">
      <Link href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeCard recipe={recipe}></RecipeCard>
      </Link>
    </div>
  ));

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full">
      <div className="flex flex-wrap justify-center items-center w-full mb-16">
        {recentRecipes}
      </div>
      <RecipePagination
        queryStr={decodedUrl}
        pageNow={Number(params.pageNumber)}
        pageMax={pnMaxCnt}
      ></RecipePagination>
    </div>
  );
}
