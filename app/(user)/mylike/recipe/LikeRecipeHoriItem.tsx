import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Image from "next/image";
import React from "react";
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from '@/app/(utils)/NumberUtil';

function LikeRecipeHoriItem({recipe}:{recipe:Recipe}){
    return (
        <div className="w-full flex justify-start items-center h-[120px] mt-2 p-3 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <section className="w-[100px] h-[100px] img-wrapper-square overflow-hidden rounded-md">
                <Image
                    className="inner-img"
                    src={recipe.repriPhotos[0]}
                    loading="lazy"
                    alt=""
                    fill
                />
            </section>
            <div className="flex flex-col ms-5 w-full items-start justify-start">
                <div className="flex justify-start items-center w-full">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.recipeName}</h1>
                    <span className="flex-center font-bold text-[0.8rem] mr-2 text-[#3b3b3b]">
                    <StarIcon className="mb-1 fill-[#FFB701]"/>{recipe.reviewAvg?roundToNPlaces(recipe.reviewAvg, 2):"-"}
                    </span>
                </div>
                <div className="flex items-center justify-center text-sm mt-6 text-[#3b3b3b]">
                    <div className='flex '>
                        <svg width="40" height="23" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="11" r="8" fill="transparent" stroke="black" strokeWidth="3"/>
                        <circle cx="10" cy="11" r="3" fill="black"/>
                        <circle cx="26" cy="11" r="8" fill="transparent" stroke="black" strokeWidth="3"/>
                        <circle cx="23" cy="11" r="3" fill="black"/>
                        </svg>
                        {recipe.viewCnt}
                    </div>
                    <div className='ms-2'>
                        <FavoriteIcon/>
                        <span className='ms-1'>{recipe?.likeCnt}</span>
                    </div>
                    <div className='ms-2'>
                        <CommentIcon/>
                        <span className='ms-1'>{recipe?.reviewCnt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(LikeRecipeHoriItem);