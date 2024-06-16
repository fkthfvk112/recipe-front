import Link from "next/link";
import RecipeCard from "./(commom)/RecipeCard";
import { Recipe } from "./(recipe)/types/recipeType";
import EmblaCarousel_comp from "./(commom)/EmbalCarousel/EmblaCarousel_comp";
import RecipeVerticalItem from "./(board)/board/create/[boardMstUUID]/(Recipe)/RecipeVerticalItem";

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

  console.log("레시피123123", fetchData);
  const recentRecipes = fetchData?.map((recipe, inx) => (
      <Link key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeVerticalItem recipe={recipe}></RecipeVerticalItem>
      </Link>
  ));

  return (
    <div className="w-full max-w-5xl p-5 mt-10 mb-10">
      <h2 className="text-xl">최근 레시피</h2>
      <p className="mb-10">최근에 공개된 레시피에요.</p>
      <EmblaCarousel_comp slides={recentRecipes}/>
      {/* <div className="flex flex-wrap justify-center items-center">
        {recentRecipes}
      </div> */}
    </div>
  );
}
