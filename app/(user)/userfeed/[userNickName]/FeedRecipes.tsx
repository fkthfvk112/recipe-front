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
  const [myRecipes, setMyRecipes] = useState<myRecipe[]>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}recipe/get-user-recipe?userNickName=${userNickName}`
      )
      .then((res) => {
        setMyRecipes(res.data);
      })
      .catch((err) => {
        console.log("아시오스 에러", err);
      });
  }, [userNickName]);

  const feedPhotos = myRecipes?.map((recipe, inx) => (
    <Link
      className="flex justify-center items-center relative w-1/3 aspect-square p-0.5"
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
      <Image
        style={{
          objectFit: "cover",
        }}
        fill
        src={recipe.repriPhotos[0]}
        alt="no img"
      ></Image>
    </Link>
  ));

  return <div className="flex flex-wrap w-full">{feedPhotos}</div>;
}
