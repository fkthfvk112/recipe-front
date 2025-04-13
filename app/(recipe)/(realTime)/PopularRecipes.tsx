
import Link from "next/link";
import { Recipe } from "../types/recipeType";
import RecipeVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";
import { BestRecipeCard } from "./BestRecipeCard";

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

  const recentRecipes = fetchData?.slice(1).map((recipe, inx) => (
    <Link className="inline-block" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
      <RecipeVerticalItem recipe={recipe}></RecipeVerticalItem>
    </Link>
  ));


  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-5">
      {fetchData[0] && <BestRecipeCard recipe={fetchData[0] as Recipe}/>}
      <h2 className="text-xl">인기 레시피</h2>
      {/* <EmblaCarousel_comp slides={recentRecipes}/> */}
      <ul className="flex overflow-x-scroll h-[350px]">
        {recentRecipes}
      </ul>
    </div>
  );
}
