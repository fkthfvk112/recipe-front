import Link from "next/link";
import RecipeCard from "./(commom)/RecipeCard";
import { Recipe } from "./(recipe)/types/recipeType";

export default async function RecentRecipes() {
  const fetchData: Recipe[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/get-new-recipe`,
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

  const recentRecipes = fetchData.map((recipe, inx) => (
    <div key={inx} className="m-3">
      <Link href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeCard recipe={recipe}></RecipeCard>
      </Link>
    </div>
  ));

  console.log("데이터", fetchData);
  return (
    <div className="m-9">
      <h2 className="text-xl">최근 레시피</h2>
      <p>최근에 공개된 레시피에요.</p>
      <div className="flex flex-wrap justify-center items-center">
        {recentRecipes}
      </div>
    </div>
  );
}
