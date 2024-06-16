import RecipeVerticalItem from "@/app/(board)/board/create/[boardMstUUID]/(Recipe)/RecipeVerticalItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface myRecipe {
  recipeId: number;
  recipeName: string;
  repriPhotos: string[];
}
export default function MyLike() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axiosAuthInstacne
      .get(`like/recipe/like-list`)
      .then((res) => {
        console.log("라이크", res.data);
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

  return <div className="flex flex-wrap w-full">{feedPhotos}</div>;
}
