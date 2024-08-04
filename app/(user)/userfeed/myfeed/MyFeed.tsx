import RecipeVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyFeed() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axiosAuthInstacne
      .get(`recipe/get-my-recipe`)
      .then((res) => {
        setMyRecipes(res.data);
      })
      .catch((err) => {
        console.log("아시오스 에러", err);
      });
  }, []);

  const feedPhotos = myRecipes?.map((recipe, inx) => (
    <Link
      className="flex justify-center items-center"
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
      <RecipeVerticalItem key={inx} recipe={recipe}/>
    </Link>
  ));

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="flex justify-center items-center flex-wrap w-full p-2">
        {feedPhotos}
       </div>
    </div>
  );
}
