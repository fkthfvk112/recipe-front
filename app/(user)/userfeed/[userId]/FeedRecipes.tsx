import RecipeSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Recipe)/RecipeSquareItem";
import { useUserFeedRecipeInxPagenation } from "@/app/(commom)/Hook/useUserFeedRecipeInxPagenation";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilState } from "recoil";

export default function FeedRecipes({
  userId,
}: {
  userId: string;
}) {
  const [recipeData, recipeRefetcher, isLoading] = useUserFeedRecipeInxPagenation({userId});
  const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.user_feed_recipe_key + userId));

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

  const feedPhotos = recipeData.cachedData.data?.map((recipe, inx) => (
    <Link
      key={inx}
      href={`/recipe-detail/${recipe.recipeId}`}
    >
      <RecipeSquareItem key={inx} recipe={recipe}/>
    </Link>
  ));

  return (
    <div className="min-h-screen w-full">
      <ul className="grid grid-cols-3 w-full gap-1 p-2">
        {feedPhotos}
      </ul>
      <div className="h-10 w-full text-center mt-10" ref={viewRef}>
          {isLoading && <CircularProgress />}
      </div>
    </div>
  );
}
