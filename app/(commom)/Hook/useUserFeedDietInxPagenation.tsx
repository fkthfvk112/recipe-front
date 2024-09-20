import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { CacheData } from "@/app/(recoil)/boardCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { FeedDietCacheData, userFeedDietCacheSelectorAtom } from "@/app/(recoil)/userFeedDietCacheSelector";
import { DietDay } from "@/app/(type)/diet";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { useRecoilState } from "recoil";


interface userFeedDietInxPagenationProp{
    userNickName:string;
    paramOption?:{
        size?:number;
    }
}

export const useUserFeedDietInxPagenation = ({userNickName, paramOption}:userFeedDietInxPagenationProp):[CacheData<FeedDietCacheData>, DispatchWithoutAction, boolean]=>{
    const [dietCache, setDietCache] = useRecoilState(
        userFeedDietCacheSelectorAtom(cacheKey.user_feed_diet_key + userNickName)
    );
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(dietCache.cachedData.isEnd) return;
        setIsLoading(true);
        defaultAxios.get("diet/day/user-days/inx-pagination", {
                        params:{
                            userNickName:userNickName,
                            dateInx:dietCache.cachedData.dateInx,
                            size:paramOption?.size||9
                        }
                    })
                    .then((res)=>{
                        const fetchedData = res.data as IndexPagenation<DietDay[], string>;
                        setDietCache({
                            cacheId:cacheKey.user_feed_diet_key + userNickName,
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