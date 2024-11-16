import { CookingSteps_show, Ingredient } from "../../types/recipeType";
import UserInfo from "./UserInfo";
import Ingredients from "./Ingredients";
import RecipeInfo, { RecipeInfoProp } from "./RecipeInfo";
import RecipeStepInfo from "./RecipeStepInfo";
import EditDel from "@/app/(commom)/CRUD/EditDel";
import CopyUrl from "@/app/(commom)/CRUD/CopyUrl";
import ReviewContainer from "../(review)/ReviewContainer";
import serverFetch from "@/app/(commom)/serverFetch";
import ReportPost, { DomainType } from "@/app/(commom)/Component/(report)/ReportPost";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ recipeId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const recipeId = (await params).recipeId
  
  const fetchData = await serverFetch({
    url:`recipe/detail?recipeId=${recipeId}`,
    option:{
        cache: "default",
        next:{
              tags: [`recipeDetail-${recipeId}`],
          }
      }
  })
  let recipeDetail: RecipeDetail = fetchData.recipeDTO;

  return {
    title: `${recipeDetail.recipeName} - 머그인`,
    description: recipeDetail?.description || "맛있는 레시피",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: `${recipeDetail.recipeName} - 머그인`,
      description: recipeDetail?.description || "맛있는 레시피",
      images:recipeDetail.repriPhotos
    }
  }
}


interface RecipeDetail {
  recipeName: string;
  repriPhotos: string[];
  categorie: string;
  servings: number;
  cookMethod: string;
  description: string;
  ingredients: Ingredient[];
  steps: CookingSteps_show[];
  reviewAvg:number;
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
    url:`recipe/detail?recipeId=${params.recipeId}`,
    option:{
        cache: "default",
        next:{
              tags: [`recipeDetail-${params.recipeId}`],
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
    reviewAvg:recipeDetail.reviewAvg,
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
        <div className="w-full p-3 text-left flex">
            <CopyUrl></CopyUrl>
            {/* have to : user ID -> user uuid */}
            <EditDel ownerUserId={recipeOwner?.userId} editReturnURl={`edit-recipe/${params.recipeId}`} 
              delPostUrl={`recipe/del?recipeId=${params.recipeId}`} delReturnUrl="/"
              revalidateTagName={`/recipeDetail-${params.recipeId}`}/>
            <ReportPost domainType={DomainType.Recipe} domainId={params.recipeId}/>
        </div>
        <div className="bg-white p-5 mb-3 w-full">
          <ReviewContainer domainId={params.recipeId} domainName={"recipe"}></ReviewContainer>
        </div>
      </div>
    </div>
  );
}
