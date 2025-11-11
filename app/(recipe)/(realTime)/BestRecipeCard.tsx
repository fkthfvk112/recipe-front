"use client"

import StarIcon from '@mui/icons-material/Star';
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useRouter } from "next/navigation";
import { roundToNPlaces } from '@/app/(utils)/NumberUtil';
export type BestRecipe = {
  recipeId: number | string;
  recipeName: string;
  repriPhotos: string[];
  reviewAvg?: number | null;
  reviewCnt?: number | null;
  createdAt?: string | Date | null;
  description?: string | null;
};

export function BestRecipeCard({ recipe }: { recipe: BestRecipe }) {
  const router = useRouter();

  const goRecipe = () => {
    router.push(`/recipe-detail/${recipe.recipeId}`);
  };

  const cover =
    recipe?.repriPhotos?.[0] ??
    "/images/placeholder-recipe.jpg"; // 없는 경우 대비(있으면 교체)

  const created = recipe?.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("ko-KR")
    : "";

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800">🌟 최고의 레시피</h1>

      <section
        role="region"
        aria-label="베스트 레시피"
        className="mb-10 mt-3 overflow-hidden rounded-xl bg-[#edf6f9] shadow-md"
      >
        <div className="flex flex-col md:flex-row">
          {/* 이미지 */}
          <div className="w-full md:w-[420px] lg:w-[500px] md:shrink-0">
            <div className="relative aspect-[5/3] md:aspect-square">
              <Image
                src={cover}
                alt={recipe?.recipeName ? `${recipe.recipeName} 대표 이미지` : "레시피 이미지"}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority={false}
              />
            </div>
          </div>

          {/* 텍스트 컨텐츠 */}
          <div className="flex flex-1 flex-col p-6 md:justify-center gap-2">
            {/* 제목 + 별점 */}
            <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-[22px]/[32px] lg:text-[25px]/[32px]">
              {/* 제목 래퍼: w-0 flex-1 로 수축 허용 */}
              <div className="w-0 flex-1">
                <h2
                  className="truncate"
                  title={recipe?.recipeName ?? ""}
                >
                  {recipe?.recipeName ?? ""}
                </h2>
              </div>
              {/* 별점: 수축 금지 */}
              <span className="flex items-center shrink-0 text-[0.85rem] text-[#3b3b3b]">
                <StarIcon className="mb-0.5 h-4 w-4 fill-[#FFB701]" />
                <span className="ml-1">
                  {recipe?.reviewAvg != null ? roundToNPlaces(recipe.reviewAvg, 2) : "-"}
                </span>
              </span>
            </div>

            {/* 메타 정보 */}
            <div className="mb-2 flex flex-row items-center justify-center gap-x-4 lg:justify-start text-xs/[14px]">
              <div className="flex items-center text-[#3b3b3b]">
                <LocalDiningIcon className="h-5 w-5" />
                <span className="ml-1">{created}</span>
              </div>
              <div className="flex items-center text-[#3b3b3b]">
                <CommentIcon className="h-5 w-5" />
                <span className="ms-1 text-[12px]">{recipe?.reviewCnt ?? 0}</span>
              </div>
            </div>

            {/* 설명 (2~3줄 말줄임: line-clamp 사용 중이면 켜기) */}
            <p
              className="
                text-center md:text-start text-[#3b3b3b]
                overflow-hidden
              "
              // Tailwind line-clamp 플러그인 사용 시 아래 클래스 추가:
              // className="text-center md:text-start text-[#3b3b3b] line-clamp-3"
              title={recipe?.description ?? ""}
            >
              {recipe?.description ?? ""}
            </p>

            <button
              onClick={goRecipe}
              className="greenBtn mt-6 w-full md:w-auto"
              aria-label="레시피 상세 보러가기"
            >
              레시피 보러가기
            </button>
          </div>
        </div>
      </section>
    </>
  );
}