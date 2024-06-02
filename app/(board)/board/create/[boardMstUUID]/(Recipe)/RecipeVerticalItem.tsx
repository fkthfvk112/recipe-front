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
    <Card variant="outlined" sx={{ width: 170,  margin:"5px" }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <Image
            src={recipe.repriPhotos[0]}
            width={300}
            height={300}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <h2 className="text-[14px]">{truncateString(recipe.recipeName, 10)}</h2>
        <div className="text-[12px]">{truncateString(recipe.description, 25)}</div>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2">
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center">
                <svg width="20" height="11" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="5" r="4" fill="transparent" stroke="black" stroke-width="3"/>
                  <circle cx="5" cy="5" r="1.5" fill="black"/>
                  <circle cx="13" cy="5" r="4" fill="transparent" stroke="black" stroke-width="3"/>
                  <circle cx="11" cy="5" r="1.5" fill="black"/>
                </svg>
                <span className="text-[10px]">{recipe.views}</span>
              </div>
                <div className="ms-2 flex justify-center items-center">
                    <FavoriteIcon className="w-[13px] h-[13px]"/><span className="ms-1 text-[10px]">{recipe?.likeCnt}</span>
                </div>
                <div className="ms-2 flex justify-center items-center">
                <CommentIcon className="w-[13px] h-[13px]"/><span className="ms-1 text-[10px]">{recipe?.reviewCnt}</span>
                </div>
            </div>
            <div className="text-[10px] flex justify-center items-center">
                {recipe.createdAt &&
                timeDifferenceString(new Date(recipe.createdAt))}
            </div>
        </div>
      </CardOverflow>
    </Card>
  );
}

export default React.memo(RecipeVerticalItem);