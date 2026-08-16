"use client";

import { Recipe } from "@/app/(recipe)/types/recipeType";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { roundToNPlaces } from "@/app/(utils)/NumberUtil";
import React from "react";

function RecipeSquareItem({ recipe }: { recipe: Recipe }) {
  const imageUrl =
    recipe.repriPhotos && recipe.repriPhotos.length > 0
      ? recipe.repriPhotos[0]
      : "/common/no-image.png";

  return (
    <div className="flex flex-col w-full group cursor-pointer bg-white rounded-2xl p-2 border border-gray-100/90 shadow-2xs hover:shadow-md transition-all">
      {/* 썸네일 이미지 (Aspect 1:1 Square) */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100/40">
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 768px) 33vw, 200px"
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          alt={recipe.recipeName || "레시피 이미지"}
        />
      </div>

      {/* 정보 라인 */}
      <div className="flex flex-col pt-2 px-1 gap-1">
        <h3 className="font-extrabold text-gray-800 text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {recipe.recipeName}
        </h3>

        <div className="flex items-center justify-between text-[11px] font-bold pt-1 border-t border-gray-50">
          <span className="flex items-center gap-0.5 text-amber-500">
            <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
            <span>{recipe.reviewAvg ? roundToNPlaces(recipe.reviewAvg, 2) : "-"}</span>
          </span>

          <span className="flex items-center gap-0.5 text-gray-400 font-semibold">
            <BookmarkAddedIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
            <span>{recipe?.likeCnt || 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RecipeSquareItem);