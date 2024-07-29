import Link from "next/link";
import { Recipe } from "../types/recipeType";
import RecipeVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";

export default async function PopularRecipes() {
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?servingsMin=1&servingsMax=20&sortingCondition=POPULARITY&page=1&size=10`,
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

  console.log("팽;체체체", fetchData);
  const recentRecipes = fetchData?.map((recipe, inx) => (
      <Link className="inline-block" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeVerticalItem recipe={recipe}></RecipeVerticalItem>
      </Link>
  ));

  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-5">
      <h2 className="text-xl">인기 레시피</h2>
      <p className="mb-10">인기있는 레시피들을 모아봤어요.</p>
      {/* <EmblaCarousel_comp slides={recentRecipes}/> */}
      <div className="flex overflow-x-scroll">
        {recentRecipes}
      </div>
    </div>
  );
}
