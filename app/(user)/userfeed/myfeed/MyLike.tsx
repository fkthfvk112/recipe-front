import RecipeVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";
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
      href={`/recipe-detail/${recipe.recipeId}`}>
      <RecipeVerticalItem key={inx} recipe={recipe}/>
    </Link>
  ));

  return(
    <div className="flex justify-center items-start h-screen">
      <div className="flex justify-center items-center flex-wrap w-full p-2">
        {feedPhotos}
      </div>
    </div>
  )
}
