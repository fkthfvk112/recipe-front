import Link from "next/link";
import { Recipe } from "../types/recipeType";
import RecipeVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";

export default async function RecentRecipes() {
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/recent-recipe`,
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

  const recentRecipes = fetchData?.map((recipe, inx) => (
      <Link className="inline-block" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeVerticalItem recipe={recipe}></RecipeVerticalItem>
      </Link>
  ));

  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-5">
      <h2 className="text-xl">최근 레시피</h2>
      {/* <EmblaCarousel_comp slides={recentRecipes}/> */}
      <ul className="flex overflow-x-scroll h-[350px]">
        {recentRecipes}
      </ul>
    </div>
  );
}
