import RecipeSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeSquareItem";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface myRecipe {
  recipeId: number;
  recipeName: string;
  repriPhotos: string[];
}

export default function FeedRecipes({
  userNickName,
}: {
  userNickName: String;
}) {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}recipe/get-user-recipe?userNickName=${userNickName}`
      )
      .then((res) => {
        setMyRecipes(res.data);
      })
  }, [userNickName]);

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
