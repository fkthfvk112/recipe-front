import Link from "next/link";
import { Recipe } from "../types/recipeType";
import RecipeCard from "@/app/(commom)/RecipeCard";

export default async function RecentRecipes() {
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/recent-recipe`,
    {
      cache: "no-cache",
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
    } else {
      return res.json();
    }
  });

  const recentRecipes = fetchData?.map((recipe, inx) => (
      <Link className="inline-block w-[180px] sm:w-[220px] shrink-0" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeCard recipe={recipe}></RecipeCard>
      </Link>
  ));

  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-5">
      <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight mb-4">최근 레시피</h2>
      <ul className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
        {recentRecipes}
      </ul>
    </div>
  );
}
