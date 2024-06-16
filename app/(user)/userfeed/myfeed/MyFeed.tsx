import RecipeVerticalItem from "@/app/(board)/board/create/[boardMstUUID]/(Recipe)/RecipeVerticalItem";
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
        console.log(res.data);
        setMyRecipes(res.data);
      })
      .catch((err) => {
        console.log("아시오스 에러", err);
      });
  }, []);

  const feedPhotos = myRecipes?.map((recipe, inx) => (
    <Link
      className="flex justify-center items-center relative w-1/3 aspect-square p-0.5"
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
      <RecipeVerticalItem key={inx} recipe={recipe}/>
    </Link>
  ));

  return <div className="flex justify-start items-center flex-wrap w-full">{feedPhotos}</div>;
}
