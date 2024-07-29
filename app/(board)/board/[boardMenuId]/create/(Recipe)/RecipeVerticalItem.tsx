import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
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
    <div className="flex flex-col justify-between hover:bg-[#e1e1e1] cursor-pointer w-[200px] h-[200px] m-1 shadow-md border border-[#e1e1e1]">
      <div>
        <div className="w-full h-20 img-wrapper-square">
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
            <h2 className="text-[14px]">{truncateString(recipe.recipeName, 20)}</h2>
          </div>
          <div className="text-[12px] h-7">{truncateString(recipe.description, 25)}</div>
        </section>
      </div>
      <div className="w-full ps-2 pe-2">
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2">
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center">
                <svg width="28" height="15" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="6" fill="transparent" stroke="black" stroke-width="2"/>
                  <circle cx="5" cy="7" r="2" fill="black" />
                  <circle cx="19" cy="7" r="6" fill="transparent" stroke="black" stroke-width="2"/>
                  <circle cx="16.5" cy="7" r="2" fill="black"/>
                </svg>
                <span className="text-[10px]">{recipe.viewCnt}</span>
              </div>
                <div className="ms-2 flex justify-center items-center">
                    <FavoriteIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[10px]">{recipe?.likeCnt}</span>
                </div>
                <div className="ms-2 flex justify-center items-center">
                <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[10px]">{recipe?.reviewCnt}</span>
                </div>
            </div>
            <div className="text-[10px] flex justify-center items-center">
                {recipe.createdAt &&
                timeDifferenceString(new Date(recipe.createdAt))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RecipeVerticalItem);