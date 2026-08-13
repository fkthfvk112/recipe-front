"use client"

import { Recipe } from "../(recipe)/types/recipeType";
import Image from "next/image";
import { timeDifferenceString } from "../(utils)/timeUtils";
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "../(utils)/NumberUtil";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const imageUrl = recipe.repriPhotos && recipe.repriPhotos.length > 0 
    ? recipe.repriPhotos[0] 
    : "/common/no-image.png";

  return (
    <div className="flex flex-col bg-transparent w-full mb-6 group cursor-pointer">
      {/* Thumbnail Area - Rounded aspect-square */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100/30">
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          alt={recipe.recipeName || "레시피 이미지"}
        />
      </div>

      {/* Content Area - Clean text layout without cards */}
      <div className="flex flex-col pt-3.5 px-0.5 gap-1">
        
        {/* Category tag - Olive tone */}
        {recipe.categorie && (
          <span className="text-[11px] font-black text-mugin-secondary uppercase tracking-wider">
            {recipe.categorie}
          </span>
        )}

        {/* Title */}
        <h3 className="font-extrabold text-gray-800 text-[14px] sm:text-[15px] leading-snug group-hover:text-mugin-secondary transition-colors duration-200 line-clamp-1">
          {recipe.recipeName}
        </h3>

        {/* Description */}
        <p className="text-[11px] sm:text-[12px] text-gray-400 font-medium line-clamp-1">
          {recipe.description || "설명이 없는 레시피입니다."}
        </p>

        {/* Meta Stats (Star Rating, Bookmarks, Comments) */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400 pt-1 mt-1 border-t border-gray-50">
          <span className="flex items-center text-mugin-accent">
            <StarIcon sx={{ fontSize: 13, marginRight: "1.5px" }} />
            {recipe.reviewAvg ? roundToNPlaces(recipe.reviewAvg, 2) : "-"}
          </span>
          <span className="flex items-center">
            <BookmarkAddedIcon sx={{ fontSize: 13, marginRight: "1.5px", color: "#9CA3AF" }} />
            {recipe?.likeCnt || 0}
          </span>
          <span className="flex items-center">
            <CommentIcon sx={{ fontSize: 12, marginRight: "1.5px", color: "#9CA3AF" }} />
            {recipe?.reviewCnt || 0}
          </span>
          <span className="ml-auto text-[9px] text-gray-400 font-medium shrink-0">
            {recipe.createdAt && timeDifferenceString(new Date(recipe.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
}
