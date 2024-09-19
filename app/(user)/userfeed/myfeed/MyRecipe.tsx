import RecipeSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeSquareItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyRecipe() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axiosAuthInstacne
      .get(`recipe/get-my-recipe`)
      .then((res) => {
        setMyRecipes(res.data);
      })
  }, []);

  const feedPhotos = myRecipes?.map((recipe, inx) => (
    <Link
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
      <RecipeSquareItem key={inx} recipe={recipe}/>
    </Link>
  ));

  return (
    <div className="h-screen w-full">
      <ul className="grid grid-cols-3 w-full gap-1 p-2">
      {feedPhotos}
       </ul>
    </div>
  );
}
