import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { timeDifferenceString } from "@/app/(utils)/timeUtils";
import React from "react";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { truncateString } from "@/app/(utils)/StringUtil";

function RecipeVerticalItem({ recipe }: { recipe: Recipe }) {

  return (
    <li className="flex flex-col justify-between hover:bg-[#e1e1e1] cursor-pointer w-[200px] m-1 border border-[#e1e1e1] rounded-md">
      <div className="aspect-square w-full img-wrapper-square overflow-hidden">
        <Image
          className="inner-img"
            src={recipe.repriPhotos[0]}
            width={300}
            height={300}
            loading="lazy"
            alt=""
          />
      </div>
      <section className="W-full p-2">
        <div className="w-full h-[35px]">
          <h2 className="text-[14px]">{truncateString(recipe.recipeName, 12)}</h2>
        </div>
        <div className="text-[12px] h-7">{truncateString(recipe.description, 18)}</div>
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