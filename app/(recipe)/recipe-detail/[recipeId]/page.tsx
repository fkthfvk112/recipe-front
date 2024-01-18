import Image from "next/image";
import { CookingSteps_show, Ingredient } from "../../types/recipeType";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";
import Ingredients from "./Ingredients";
import RecipeInfo, { RecipeInfoProp } from "./RecipeInfo";
import RecipeStepInfo from "./RecipeStepInfo";

interface RecipeDetail {
  recipeName: string;
  categorie: string;
  servings: number;
  cookMethod: string;
  description: string;
  ingredients: Ingredient[];
  steps: CookingSteps_show[];
}

export interface RecipeOwnerInfo {
  userId: string;
}

export default async function RecipeDetail({
  params,
}: {
  params: { recipeId: string };
}) {
  const fetchData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/get-recipe?recipeId=${params.recipeId}`
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
      redirect("/");
    } else {
      return res.json();
    }
  });

  let recipeDetail: RecipeDetail = fetchData.recipeDTO;
  let recipeOwner: RecipeOwnerInfo = fetchData.recipeOwnerInfo;

  console.log(recipeDetail);

  const recipeInfo: RecipeInfoProp = {
    recipeName: recipeDetail.recipeName,
    categorie: recipeDetail.categorie,
    servings: recipeDetail.servings,
    description: recipeDetail.description,
    timeSum: recipeDetail.steps.reduce((accumulator, step) => {
      return accumulator + step.time;
    }, 0),
  };

  return (
    <div className="p-5 max-w-xl w-dvw m-3 bg-white px-4 flex flex-col justify-center items-center">
      <UserInfo recipeOwner={recipeOwner}></UserInfo>
      <RecipeInfo recipeInfoProp={recipeInfo}></RecipeInfo>
      <Ingredients ingredients={recipeDetail.ingredients}></Ingredients>
      <RecipeStepInfo steps={recipeDetail.steps}></RecipeStepInfo>
    </div>
  );
}
