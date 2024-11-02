"use client"

import { Recipe } from "../(recipe)/types/recipeType";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { timeDifferenceString } from "../(utils)/timeUtils";
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "../(utils)/NumberUtil";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {

  return (
    <Card variant="outlined" sx={{ aspectRatio:"1 / 1", minWidth:"140px", marginBottom:"1rem" }}>
      <CardOverflow>
        <AspectRatio sx={{ overflow:"hidden"}} ratio="1/1">
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
          <div className="flex justify-start items-center w-full">
            <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.recipeName}</h1>
            <span className="flex-center font-bold text-[0.8rem] mr-2 text-[#3b3b3b]">
              <StarIcon className="mb-1 fill-[#FFB701]"/>{recipe.reviewAvg?roundToNPlaces(recipe.reviewAvg, 2):"-"}
            </span>
          </div>
        <section className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.description}</section>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2 text-[#3b3b3b]">
          <div className="flex">
            <div>
              <BookmarkAddedIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.likeCnt}</span>
            </div>
            <div className="ms-2">
              <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.reviewCnt}</span>
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
