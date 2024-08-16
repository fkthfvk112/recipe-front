import { CookingSteps_show, Ingredient } from "../../types/recipeType";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";
import Ingredients from "./Ingredients";
import RecipeInfo, { RecipeInfoProp } from "./RecipeInfo";
import RecipeStepInfo from "./RecipeStepInfo";
import EditDel from "@/app/(commom)/CRUD/EditDel";
import CopyUrl from "@/app/(commom)/CRUD/CopyUrl";
import ReviewContainer from "../(review)/ReviewContainer";
import serverFetch from "@/app/(commom)/serverFetch";

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
  userId:string;
  userNickName: string;
  userPhoto: string;
  userUrl: string;
  userIntro: string;
}

export default async function RecipeDetail({
  params,
}: {
  params: { recipeId: number };
}) {

  const fetchData = await serverFetch({
    url:`recipe/get-recipe?recipeId=${params.recipeId}`,
    option:{
        cache: "force-cache",
        next:{
              tags: [`boardDetail-${params.recipeId}`],
          }
      }
  })

  let recipeDetail: RecipeDetail = fetchData.recipeDTO;
  let recipeOwner: RecipeOwnerInfo = fetchData.recipeOwnerInfo;


  const recipeInfo: RecipeInfoProp = {
    recipeId: Number(params.recipeId),
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
    <div className='w-full bg-[#1c7c54]  flex flex-col justify-start items-center pt-14 pb-14 min-h-dvh'>    
      <div className=" max-w-3xl w-dvw m-3 bg-white flex flex-col justify-center items-center rounded-lg">
        <div className="p-5 mb-3 w-full">
          <UserInfo recipeOwner={recipeOwner}></UserInfo>
          <RecipeInfo recipeInfoProp={recipeInfo}></RecipeInfo>
          <Ingredients ingredients={recipeDetail.ingredients}></Ingredients>
          <RecipeStepInfo steps={recipeDetail.steps}></RecipeStepInfo>
        </div>
        <div className="w-full p-3 text-left">
            <CopyUrl></CopyUrl>
            {/* have to : user ID -> user uuid */}
            <EditDel ownerUserId={recipeOwner?.userId} editReturnURl={`edit-recipe/${params.recipeId}`} delPostUrl="/" delReturnUrl="/"/>
        </div>
        <div className="bg-white p-5 mb-3 w-full">
          <ReviewContainer domainId={params.recipeId} domainName={"recipe"}></ReviewContainer>
        </div>
      </div>
    </div>
  );
}
