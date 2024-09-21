"use client"
import RecipeHoriItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeHoriItem";
import { useLikeRecipeInxPagenation } from "@/app/(commom)/Hook/useLikeRecipeInxPagenation";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilState } from "recoil";
import LikeRecipeHoriItem from "./LikeRecipeHoriItem";
import { CircularProgress } from "@mui/material";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";

export default function MyLikeRecipe(){
    const [recipeData, recipeRefetcher, isLoading] = useLikeRecipeInxPagenation({});
    const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.user_feed_like_recipe_key + 'myFeedRecipe'));
  
    const [viewRef, inview] = useInView();
  
    useEffect(()=>{
      if(isLoading) return;
      if(inview){
        recipeRefetcher();
      }
    }, [inview, isLoading])
  
    useEffect(()=>{
      if(cachedScrollY){
          window.scrollTo({
              top: cachedScrollY
          });
      }
      return()=>{
          setScrollYCache(scrollY);
      }
    }, [])


    
  const likeRecipes = recipeData.cachedData.data?.map((recipe, inx) => (
    <Link
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
        <LikeRecipeHoriItem key={inx} recipe={recipe} /> 
    </Link>
  ));

    return (
        <div className={`defaultOuterContainer flex pb-20`}>
            <TitleDescription title={`내가 찜한 레시피`} desc={`내가 찜한 레시피만 모아 놓았어요`}/>

            <main className="defaultInnerContainer pt-10 pb-[100px] p-2">
                <div className="p-2">
                    {likeRecipes}
                </div>
                <div className="h-10 w-full text-center mt-10" ref={viewRef}>
                    {isLoading && <CircularProgress />}
                </div>
            </main>
        </div>
    )
}