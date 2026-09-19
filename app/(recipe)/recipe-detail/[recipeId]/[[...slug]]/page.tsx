import { CookingSteps_show, Ingredient } from "../../../types/recipeType";
import UserInfo from "../UserInfo";
import Ingredients from "../Ingredients";
import RecipeInfo, { RecipeInfoProp } from "../RecipeInfo";
import RecipeStepInfo from "../RecipeStepInfo";
import EditDel from "@/app/(commom)/CRUD/EditDel";
import CopyUrl from "@/app/(commom)/CRUD/CopyUrl";
import ReviewContainer from "../../(review)/ReviewContainer";
import serverFetch from "@/app/(commom)/serverFetch";
import ReportPost, { DomainType } from "@/app/(commom)/Component/(report)/ReportPost";
import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import FallbackPage from "@/app/(commom)/Component/FallbackPage";
import { permanentRedirect } from "next/navigation";
import { generateSlug } from "@/app/(utils)/slugUtil";
import { cache } from "react";

type Props = {
  params: Promise<{ recipeId: string; slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";

function getAbsoluteImageUrl(src?: string): string {
  if (!src) return `${SITE_URL}/common/favicon.png`;
  const cleanSrc = src.split("#")[0].trim();
  if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) {
    return encodeURI(decodeURI(cleanSrc));
  }
  const fullUrl = cleanSrc.startsWith("/") ? `${SITE_URL}${cleanSrc}` : `${SITE_URL}/${cleanSrc}`;
  return encodeURI(decodeURI(fullUrl));
}

// React cache를 적용하여 동일 렌더 주기 내 generateMetadata와 RecipeDetail 간 중복 백엔드 호출 1회로 통합
const getRecipeDetail = cache(async (recipeId: string) => {
  return await serverFetch({
    url: `recipe/detail?recipeId=${recipeId}`,
    option: {
      cache: "default",
      next: {
        tags: [`recipeDetail-${recipeId}`],
      },
    },
  });
});

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { recipeId } = await params;

  const fetchData = await getRecipeDetail(recipeId);

  const recipeDetail: RecipeDetail = fetchData?.recipeDTO;
  const rawPhoto = recipeDetail?.repriPhotos?.[0];
  const photoUrl = getAbsoluteImageUrl(rawPhoto);
  const title = recipeDetail?.recipeName ? `${recipeDetail.recipeName} - 머그인 레시피` : "머그인 레시피";
  const description = recipeDetail?.description || "맛있는 식재료 관리 & 레시피 - 머그인";
  const expectedSlug = generateSlug(recipeDetail?.recipeName || "");
  const canonicalUrl = `${SITE_URL}/recipe-detail/${recipeId}/${encodeURIComponent(expectedSlug)}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: title,
    description: description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: "머그인",
      images: [
        {
          url: photoUrl,
          width: 1200,
          height: 630,
          alt: recipeDetail?.recipeName || "레시피 대표 이미지",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [photoUrl],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/common/favicon.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: "/common/favicon.png",
      apple: "/common/favicon.png",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
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
  reviewAvg: number;
  createdAt?: string;
  reviewCnt?: number;
}

export interface RecipeOwnerInfo {
  userId: string;
  userNickName: string;
  userPhoto: string;
  userUrl: string;
  userIntro: string;
}

export default async function RecipeDetail({
  params,
}: {
  params: { recipeId: string; slug?: string[] };
}) {
  const recipeId = params.recipeId;

  const fetchData = await getRecipeDetail(recipeId);

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

  const expectedSlug = generateSlug(recipeDetail.recipeName);
  const currentRawSlug = params.slug?.[0] ? params.slug[0] : null;
  let currentSlug: string | null = null;
  if (currentRawSlug) {
    try {
      currentSlug = decodeURIComponent(currentRawSlug);
    } catch (e) {
      currentSlug = currentRawSlug;
    }
  }

  // 구버전 URL(/recipe-detail/:id)로 직접 인입 시, 슬러그 불일치 시, 또는 다중 세그먼트 슬러그 인입 시 301 영구 리다이렉트
  if (!params.slug || params.slug.length !== 1 || currentSlug !== expectedSlug) {
    permanentRedirect(`/recipe-detail/${recipeId}/${encodeURIComponent(expectedSlug)}`);
  }

  const recipeInfo: RecipeInfoProp = {
    recipeId: Number(recipeId),
    recipeName: recipeDetail?.recipeName,
    categorie: recipeDetail?.categorie,
    repriPhotos: recipeDetail?.repriPhotos,
    servings: recipeDetail?.servings,
    description: recipeDetail?.description,
    reviewAvg: recipeDetail?.reviewAvg,
    timeSum: recipeDetail?.steps.reduce((accumulator, step) => {
      return accumulator + (Number(step.time) || 0);
    }, 0),
  };

  // 구글 레시피 서칭용 데이터 구조
  const mainPhotoUrl = getAbsoluteImageUrl(recipeDetail?.repriPhotos?.[0]);
  const canonicalUrl = `${SITE_URL}/recipe-detail/${recipeId}/${encodeURIComponent(expectedSlug)}`;
  const keywords = [recipeDetail.recipeName, ...(recipeDetail.ingredients?.map((i) => i.name) || [])]
    .filter(Boolean)
    .join(", ");

  let datePublished: string | undefined = undefined;
  if (recipeDetail.createdAt) {
    try {
      const parsedDate = new Date(recipeDetail.createdAt);
      if (!isNaN(parsedDate.getTime())) {
        datePublished = parsedDate.toISOString();
      }
    } catch (e) {
      // ignore invalid date string
    }
  }

  const googleRecipeSchema: any = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipeDetail.recipeName,
    url: canonicalUrl,
    image: [mainPhotoUrl],
    author: {
      "@type": "Person",
      name: recipeOwner.userNickName,
    },
    datePublished: datePublished,
    description: recipeDetail.description,
    keywords: keywords,
    recipeCuisine: recipeDetail.categorie || "기타",
    recipeYield: `${recipeDetail.servings}인분`,
    recipeCategory: recipeDetail.categorie,
    recipeIngredient: recipeDetail.ingredients.map((i) => `${i.name} ${i.qqt}`),
    recipeInstructions: recipeDetail.steps.map((step, index) => {
      const stepObj: any = {
        "@type": "HowToStep",
        name: `Step ${index + 1}`,
        text: step.description,
        url: `${canonicalUrl}#step-${index + 1}`,
      };
      if (step.photo) stepObj.image = getAbsoluteImageUrl(step.photo);
      return stepObj;
    }),
  };

  // timeSum이 0 초과일 때만 유효한 ISO 8601 기간(PT...M) 추가 (PT0M 형식 오류 경고 방지)
  if (recipeInfo.timeSum > 0) {
    const halfTime = Math.round(recipeInfo.timeSum / 2);
    googleRecipeSchema.prepTime = `PT${halfTime}M`;
    googleRecipeSchema.cookTime = `PT${halfTime}M`;
    googleRecipeSchema.totalTime = `PT${recipeInfo.timeSum}M`;
  }

  if (reviewCnt > 0) {
    googleRecipeSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: recipeDetail.reviewAvg,
      reviewCount: reviewCnt,
    };
  }

  // 브레드크럼(탐색경로) 구조화 데이터
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "레시피",
        item: `${SITE_URL}/recipes/1/sortingCondition=POPULARITY`,
      },
      ...(recipeDetail.categorie
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: recipeDetail.categorie,
              item: `${SITE_URL}/recipes/1/categorie=${encodeURIComponent(recipeDetail.categorie)}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: recipeDetail.recipeName,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: recipeDetail.recipeName,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <Script
        id="recipe-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([googleRecipeSchema, breadcrumbSchema]),
        }}
      />
      <div className="w-full bg-gray-50 flex flex-col justify-start items-center py-10 min-h-dvh sm:px-0">
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
              <EditDel
                ownerUserId={recipeOwner?.userId}
                editReturnURl={`edit-recipe/${recipeId}`}
                delPostUrl={`recipe/del?recipeId=${recipeId}`}
                delReturnUrl="/"
                revalidateTagNames={[`recipeDetail-${recipeId}`]}
              />
              <ReportPost domainType={DomainType.Recipe} domainId={Number(recipeId)} />
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 w-full border-t border-gray-100">
            <ReviewContainer domainId={Number(recipeId)} domainName={"recipe"}></ReviewContainer>
          </div>
        </div>
      </div>
    </>
  );
}
