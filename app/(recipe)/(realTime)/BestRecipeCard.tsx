"use client"

import StarIcon from '@mui/icons-material/Star';
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useRouter } from "next/navigation";
import { roundToNPlaces } from '@/app/(utils)/NumberUtil';
import Button from "@/app/(commom)/Component/Button";
import { PrimaryButton } from '@/app/(commom)/Component/Buttons';

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
    "/images/placeholder-recipe.jpg";

  const created = recipe?.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("ko-KR")
    : "";

  return (
    <div className="w-full text-left mb-10">
      <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">최고의 레시피</h1>

      <section
        role="region"
        aria-label="베스트 레시피"
        className="mb-6 mt-3 overflow-hidden rounded-3xl bg-gray-50 border border-gray-100/40 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <div className="flex flex-col md:flex-row">
          {/* 이미지 */}
          <div className="w-full md:w-[420px] lg:w-[500px] md:shrink-0">
            <div className="relative aspect-[5/3] md:aspect-square rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
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
          <div className="flex flex-1 flex-col p-6 md:p-8 md:justify-center gap-2">
            {/* 제목 + 별점 */}
            <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-[22px]/[32px] lg:text-[25px]/[32px]">
              <div className="w-0 flex-1">
                <h2
                  className="truncate text-gray-800 font-extrabold"
                  title={recipe?.recipeName ?? ""}
                >
                  {recipe?.recipeName ?? ""}
                </h2>
              </div>
              <span className="flex items-center shrink-0 text-sm font-bold text-gray-600">
                <StarIcon sx={{ color: "#FFB703", fontSize: 18 }} />
                <span className="ml-1">
                  {recipe?.reviewAvg != null ? roundToNPlaces(recipe.reviewAvg, 2) : "-"}
                </span>
              </span>
            </div>

            {/* 메타 정보 */}
            <div className="mb-2 flex flex-row items-center justify-center gap-x-4 lg:justify-start text-xs text-gray-500 font-medium">
              <div className="flex items-center">
                <LocalDiningIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />
                <span className="ml-1">{created}</span>
              </div>
              <div className="flex items-center">
                <CommentIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />
                <span className="ms-1">{recipe?.reviewCnt ?? 0}</span>
              </div>
            </div>

            {/* 설명 */}
            <p
              className="text-center md:text-start text-sm text-gray-500 leading-relaxed overflow-hidden"
              title={recipe?.description ?? ""}
            >
              {recipe?.description ?? ""}
            </p>

            <div className="mt-6 flex">
              <PrimaryButton
                size="md"
                onClick={goRecipe}
                aria-label="레시피 상세 보러가기"
                className="w-full md:w-auto font-extrabold"
              >
                레시피 보러가기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}