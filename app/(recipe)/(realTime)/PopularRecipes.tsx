import Link from "next/link";
import { Recipe } from "../types/recipeType";
import RecipeCard from "@/app/(commom)/RecipeCard";
import { BestRecipe, BestRecipeCard } from "./BestRecipeCard";

export default async function PopularRecipes() {
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?sortingCondition=POPULARITY&page=1&size=10`,
    {
      next: { revalidate: 300 },
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
    } else {
      return res.json();
    }
  })
  .catch(err=>{
    console.log(err);
    return [];
  })

  const popularRecipes = fetchData?.slice(1).map((recipe, inx) => (
    <Link className="inline-block w-[180px] sm:w-[220px] shrink-0" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
      <RecipeCard recipe={recipe}></RecipeCard>
    </Link>
  ));

  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-5">
      {fetchData[0] && <BestRecipeCard recipe={fetchData[0] as BestRecipe}/>}
      <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight mb-4">인기 레시피</h2>
      <ul className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
        {popularRecipes}
      </ul>
    </div>
  );
}
