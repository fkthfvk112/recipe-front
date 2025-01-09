import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { CacheData } from "@/app/(recoil)/boardCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { FeedDietCacheData, userFeedDietCacheSelectorAtom } from "@/app/(recoil)/userFeedDietCacheSelector";
import { DietDay } from "@/app/(type)/diet";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { useRecoilState } from "recoil";


interface userFeedDietInxPagenationProp{
    userId:string;
    isMyFeed?:boolean;
    paramOption?:{
        size?:number;
    }
}

export const useUserFeedDietInxPagenation = ({userId, isMyFeed=false, paramOption}:userFeedDietInxPagenationProp):[CacheData<FeedDietCacheData>, DispatchWithoutAction, boolean]=>{
    const [dietCache, setDietCache] = useRecoilState(
        userFeedDietCacheSelectorAtom(cacheKey.user_feed_diet_key + userId)
    );
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let requestUrl = isMyFeed?'diet/day/my-days/inx-pagination' : 'diet/day/user-days/inx-pagination';


    useEffect(()=>{
        if(dietCache.cachedData.isEnd) return;
        setIsLoading(true);
        defaultAxios.get(requestUrl, {
                        params:{
                            userId:userId,
                            dateInx:dietCache.cachedData.dateInx,
                            size:paramOption?.size||9
                        }
                    })
                    .then((res)=>{
                        const fetchedData = res.data as IndexPagenation<DietDay[], string>;
                        setDietCache({
                            cacheId:cacheKey.user_feed_diet_key + userId,
                            cachedData:{
                                data:    fetchedData.data,
                                dateInx: fetchedData.index,
                                isEnd:   fetchedData.isEnd
                            }
                        });
                        setIsLoading(false);
                    });
    }, [toggle])

    return [dietCache, ()=>refetcher(), isLoading]
}   