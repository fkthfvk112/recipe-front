import DietSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Diet)/DietSquareItem";
import { useUserFeedDietInxPagenation } from "@/app/(commom)/Hook/useUserFeedDietInxPagenation";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useEffect,  } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilState } from "recoil";


export default function MyDiet() {
  const [dietData, dietRefetcher, isLoading] = useUserFeedDietInxPagenation({userNickName:"myFeedDeit", isMyFeed:true});
  const [cachedScrollY, setScrollYCache] = useRecoilState(scrollYCacheSelector(cacheKey.user_feed_diet_key + 'myFeedDeit'));

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
      href={`/diet/mydiet/${diet.dietDayId}`}
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
