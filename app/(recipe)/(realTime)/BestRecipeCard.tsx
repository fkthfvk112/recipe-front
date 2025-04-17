"use client"

import { roundToNPlaces } from "@/app/(utils)/NumberUtil";
import { Recipe } from "../types/recipeType";
import StarIcon from '@mui/icons-material/Star';
import Image from "next/image";
import CommentIcon from '@mui/icons-material/Comment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useRouter } from "next/navigation";

export function BestRecipeCard({recipe}:{recipe:Recipe}){
    const router = useRouter();

    const goRecipe = ()=>{
        router.push(`/recipe-detail/${recipe.recipeId}`);
    }
    return (
        <>
        <h1 className="text-2xl font-semibold text-gray-800">🌟 최고의 레시피</h1>
        <section className="mb-10 bg-[#edf6f9] text-center flex flex-col md:flex-row shadow-md mt-3">
            <div className="aspect-[5/3] img-wrapper-square overflow-hidden w-full md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                <Image
                className="inner-img  hover:scale-105 transition-transform duration-300"
                    src={recipe.repriPhotos[0]}
                    width={300}
                    height={300}
                    loading="lazy"
                    alt=""
                />            
            </div>
            <div className="p-6 flex flex-col md:justify-center">
                <div className="flex justify-center lg:justify-start font-bold text-[22px]/[32px] lg:text-[25px]/[32px]">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{recipe.recipeName}</h1>
                    <span className="flex-center font-bold text-[0.8rem] mr-2 text-[#3b3b3b]">
                        <StarIcon className="mb-1 fill-[#FFB701]"/>{recipe.reviewAvg?roundToNPlaces(recipe.reviewAvg, 2):"-"}
                    </span>
                </div>
                <div className="flex flex-row text-xs/[14px] gap-x-3 lg:gap-x-6 justify-center lg:justify-start items-center  mb-3">
                    <div className="text-[#3b3b3b]">
                        <LocalDiningIcon className="w-[20px] h-[20px]"/>
                        {recipe.createdAt &&
                        new Date(recipe.createdAt).toLocaleDateString('en-CA')}
                    </div>
                    <div  className="text-[#3b3b3b]">
                        <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.reviewCnt}</span>
                    </div>
                </div>
                <div className="text-[#3b3b3b] md:text-start text-center">
                    {recipe.description}
                </div>
                <button onClick={goRecipe} className="greenBtn w-full mt-6">레시피 보러가기</button>
            </div>
        </section>
        </>
    )
}