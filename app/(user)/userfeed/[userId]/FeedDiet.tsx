import DietSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Diet)/DietSquareItem";
import { useUserFeedDietInxPagenation } from "@/app/(commom)/Hook/useUserFeedDietInxPagenation";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilState } from "recoil";

export default function FeedDiet({
  userId,
}: {
  userId: string;
}) {
  const [dietData, dietRefetcher, isLoading] = useUserFeedDietInxPagenation({userId});
  const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.user_feed_diet_key + userId));

  const [viewRef, inview] = useInView();

  useEffect(()=>{
    if(isLoading) return;
    if(inview){
      dietRefetcher();
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


  const feedInfos = dietData.cachedData.data.map((diet, inx) => (
    <Link
      key={inx}
      href={`/diet/user/${diet.dietDayId}`}
    >
      <DietSquareItem dietDay={diet}/>
    </Link>
  ));

  return (
    <div className="min-h-screen w-full">
      <ul className="grid grid-cols-3 w-full gap-1 p-2">
        {feedInfos}
      </ul>
      <div className="h-10 w-full text-center mt-10" ref={viewRef}>
          {isLoading && <CircularProgress />}
      </div>
    </div>
  )
}
