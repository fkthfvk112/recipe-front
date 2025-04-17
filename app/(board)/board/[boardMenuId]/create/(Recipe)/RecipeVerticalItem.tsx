"use client"

import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Divider from "@mui/joy/Divider";
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import { timeDifferenceString } from "@/app/(utils)/timeUtils";
import React from "react";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "@/app/(utils)/NumberUtil";

function RecipeVerticalItem({ recipe }: { recipe: Recipe }) {

  return (
    <li className="flex flex-col justify-between hover:bg-[#e1e1e1] cursor-pointer w-[200px] m-1 border border-[#e1e1e1] rounded-md">
      <div className="aspect-square w-full img-wrapper-square overflow-hidden">
        <Image
          className="inner-img hover:scale-105 transition-transform duration-300"
            src={recipe.repriPhotos[0]}
            width={300}
            height={300}
            loading="lazy"
            alt=""
          />
      </div>
      <section className="W-full p-2">
        <div className="flex justify-start items-center w-full">
          <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.recipeName}</h1>
          <span className="flex-center font-bold text-[0.8rem] mr-2 text-[#3b3b3b]">
            <StarIcon className="mb-1 fill-[#FFB701]"/>{recipe.reviewAvg?roundToNPlaces(recipe.reviewAvg, 2):"-"}
          </span>
        </div>
        <div className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.description}</div>
      </section>
      <div className="w-full ps-2 pe-2">
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2 text-[#3b3b3b]">
            <div className="flex justify-center items-center">
              <div className="ms-2 flex justify-center items-center">
                <BookmarkAddedIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.likeCnt}</span>
              </div>
              <div className="ms-2 flex justify-center items-center">
                <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.reviewCnt}</span>
              </div>
            </div>
            <div className="text-[10px] flex justify-center items-center">
                {recipe.createdAt &&
                timeDifferenceString(new Date(recipe.createdAt))}
            </div>
        </div>
      </div>
    </li>
  );
}

export default React.memo(RecipeVerticalItem);