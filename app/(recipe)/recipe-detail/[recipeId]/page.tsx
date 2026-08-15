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
import Script from "next/script";
import FallbackPage from "@/app/(commom)/Component/FallbackPage";

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
  });

  let recipeDetail: RecipeDetail = fetchData.recipeDTO;

  return {
    title: `${recipeDetail?.recipeName} - 머그인`,
    description: recipeDetail?.description || "맛있는 레시피",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: `${recipeDetail?.recipeName} - 머그인`,
      description: recipeDetail?.description || "맛있는 레시피",
      images:recipeDetail?.repriPhotos[0]
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
  createdAt?:string;
  reviewCnt?:number;
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

  let recipeDetail: RecipeDetail = fetchData?.recipeDTO;
  let recipeOwner: RecipeOwnerInfo = fetchData?.recipeOwnerInfo;
  let reviewCnt: number = fetchData?.reviewCnt ?? 0;

  if (!recipeDetail) {
    return (
      <FallbackPage
        icon="🍳"
        title="레시피가 존재하지 않습니다."
        description="요청하신 레시피가 존재하지 않거나 삭제되었습니다."
        primaryAction={{ label: "레시피 목록으로", href: "/recipes/1/sortingCondition=POPULARITY" }}
      />
    );
  }
  
  const recipeInfo: RecipeInfoProp = {
    recipeId: Number(params.recipeId),
    recipeName: recipeDetail?.recipeName,
    categorie: recipeDetail?.categorie,
    repriPhotos: recipeDetail?.repriPhotos,
    servings: recipeDetail?.servings,
    description: recipeDetail?.description,
    reviewAvg:recipeDetail?.reviewAvg,
    timeSum: recipeDetail?.steps.reduce((accumulator, step) => {
      return accumulator + step.time;
    }, 0),
  };

  // 구글 레시피 서칭용 데이터 구조
  const googleRecipeSchema: any = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipeDetail.recipeName,
    "image": recipeDetail.repriPhotos[0],
    "author": {
      "@type": "Person",
      "name": recipeOwner.userNickName,
    },
    "datePublished": recipeDetail.createdAt ? new Date(recipeDetail.createdAt).toISOString() : undefined,
    "description": recipeDetail.description,
    "recipeYield": `${recipeDetail.servings}인분`,
    "recipeCategory": recipeDetail.categorie,
    "prepTime": `PT${Math.round(recipeInfo.timeSum / 2)}M`,
    "cookTime": `PT${Math.round(recipeInfo.timeSum / 2)}M`,
    "totalTime": `PT${recipeInfo.timeSum}M`,
    recipeIngredient: recipeDetail.ingredients.map((i) => `${i.name} ${i.qqt}`),
    recipeInstructions: recipeDetail.steps.map((step) => {
      const stepObj: any = {
        "@type": "HowToStep",
        "text": step.description,
      };
      if (step.photo) stepObj.image = step.photo;
      return stepObj;
    }),
  };
  
  if (reviewCnt > 0) {
    googleRecipeSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": recipeDetail.reviewAvg,
      "reviewCount": reviewCnt,
    };
  }
  

  return (
    <>
      <Script
        id="recipe-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(googleRecipeSchema) }}
      />
    <div className="w-full bg-gray-50 flex flex-col justify-start items-center py-10 min-h-dvh px-4 sm:px-0">    
      <div className="max-w-3xl w-full bg-white flex flex-col justify-center items-center rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 w-full">
          <UserInfo recipeOwner={recipeOwner}></UserInfo>
          <RecipeInfo recipeInfoProp={recipeInfo}></RecipeInfo>
          <Ingredients ingredients={recipeDetail.ingredients}></Ingredients>
          <RecipeStepInfo steps={recipeDetail.steps}></RecipeStepInfo>
        </div>
        <div className="w-full px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <CopyUrl></CopyUrl>
            <div className="flex items-center gap-2">
              <EditDel ownerUserId={recipeOwner?.userId} editReturnURl={`edit-recipe/${params.recipeId}`} 
                delPostUrl={`recipe/del?recipeId=${params.recipeId}`} delReturnUrl="/"
                revalidateTagNames={[`recipeDetail-${params.recipeId}`]}/>
              <ReportPost domainType={DomainType.Recipe} domainId={params.recipeId}/>
            </div>
        </div>
        <div className="bg-white p-6 sm:p-8 w-full border-t border-gray-100">
          <ReviewContainer domainId={params.recipeId} domainName={"recipe"}></ReviewContainer>
        </div>
      </div>
    </div>
    </>
  );
}
