import Image from "next/image";
import { CookingSteps_show, Ingredient } from "../../types/recipeType";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";
import Ingredients from "./Ingredients";
import RecipeInfo, { RecipeInfoProp } from "./RecipeInfo";
import RecipeStepInfo from "./RecipeStepInfo";
import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import ReviewContainer from "../(review)/ReviewContainer";

interface RecipeDetail {
  recipeName: string;
  repriPhotos: string[];
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
  // let userInfo: decodedUserInfo | undefined = undefined;
  // const userCookie: { name: string; value: string } | undefined =
  //   cookies().get("Authorization");
  // if (userCookie !== undefined) {
  //   userInfo = decodeUserJwt(userCookie.value);
  // }

  const fetchData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}recipe/get-recipe?recipeId=${params.recipeId}`
    // {
    //   cache: "no-cache",// 수정 - 시간 조절...views 세팅용
    // }
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
    repriPhotos: recipeDetail.repriPhotos,
    servings: recipeDetail.servings,
    description: recipeDetail.description,
    timeSum: recipeDetail.steps.reduce((accumulator, step) => {
      return accumulator + step.time;
    }, 0),
  };

  return (
    <div className=" max-w-xl w-dvw m-3  flex flex-col justify-center items-center">
      <div className="bg-white p-5 mb-3 w-full">
        <UserInfo recipeOwner={recipeOwner}></UserInfo>
        <RecipeInfo recipeInfoProp={recipeInfo}></RecipeInfo>
        <Ingredients ingredients={recipeDetail.ingredients}></Ingredients>
        <RecipeStepInfo steps={recipeDetail.steps}></RecipeStepInfo>
      </div>
      <div className="bg-white p-5 mb-3 w-full">
        <ReviewContainer recipeId={Number(params.recipeId)}></ReviewContainer>
      </div>
    </div>
  );
}
