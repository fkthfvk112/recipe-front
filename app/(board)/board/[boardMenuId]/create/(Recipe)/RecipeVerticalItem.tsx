"use client"

import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import { timeDifferenceString } from "@/app/(utils)/timeUtils";
import React from "react";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "@/app/(utils)/NumberUtil";

function RecipeVerticalItem({ recipe }: { recipe: Recipe }) {

  return (
    <li className="flex flex-col justify-between cursor-pointer w-[180px] sm:w-[200px] shrink-0 m-1 bg-transparent border-none group">
      {/* Thumbnail */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/30">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          src={recipe.repriPhotos[0] || "/common/no-image.png"}
          fill
          sizes="200px"
          loading="lazy"
          alt={recipe.recipeName || ""}
        />
      </div>

      {/* Description Info */}
      <section className="w-full pt-3.5 px-0.5 flex flex-col gap-1">
        
        {/* Category tag */}
        {recipe.categorie && (
          <span className="text-[11px] font-black text-mugin-secondary uppercase tracking-wider block">
            {recipe.categorie}
          </span>
        )}

        <div className="flex justify-between items-center w-full gap-2">
          <h3 className="font-extrabold text-gray-800 text-[14px] sm:text-[15px] whitespace-nowrap overflow-hidden text-ellipsis flex-grow group-hover:text-mugin-secondary transition-colors duration-200">
            {recipe.recipeName}
          </h3>
          <span className="flex items-center font-bold text-[11px] sm:text-[12px] text-mugin-accent shrink-0">
            <StarIcon sx={{ fontSize: 14, marginRight: "1.5px" }} />
            {recipe.reviewAvg ? roundToNPlaces(recipe.reviewAvg, 2) : "-"}
          </span>
        </div>
        
        <p className="text-[11px] sm:text-[12px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {recipe.description || "설명이 없는 레시피입니다."}
        </p>

        {/* Footer info (Bookmarks, Comments, Date) */}
        <div className="pt-2 mt-1 border-t border-gray-50 flex justify-between items-center text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <BookmarkAddedIcon sx={{ fontSize: 13, color: "#9CA3AF" }} />
              <span className="ms-0.5 text-[10px] sm:text-[11px] font-semibold">{recipe?.likeCnt || 0}</span>
            </div>
            <div className="flex items-center">
              <CommentIcon sx={{ fontSize: 12, color: "#9CA3AF" }} />
              <span className="ms-0.5 text-[10px] sm:text-[11px] font-semibold">{recipe?.reviewCnt || 0}</span>
            </div>
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
            {recipe.createdAt && timeDifferenceString(new Date(recipe.createdAt))}
          </div>
        </div>
      </section>
    </li>
  );
}

export default React.memo(RecipeVerticalItem);