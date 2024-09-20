import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { CacheData } from "@/app/(recoil)/boardCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { FeedRecipeCacheData, userFeedRecipeCacheAtom, userFeedRecipeCacheSelectorAtom } from "@/app/(recoil)/userFeedRecipeCacheSelector";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { useRecoilState } from "recoil";


interface userFeedRecipeInxPagenationProp{
    userNickName:string;
    paramOption?:{
        size?:number;
    }
}

export const useUserFeedRecipeInxPagenation = ({userNickName, paramOption}:userFeedRecipeInxPagenationProp):[CacheData<FeedRecipeCacheData>, DispatchWithoutAction, boolean]=>{
    const [recipeCache, setRecipeCache] = useRecoilState(
        userFeedRecipeCacheSelectorAtom(cacheKey.user_feed_recipe_key + userNickName)
    );
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(recipeCache.cachedData.isEnd) return;
        setIsLoading(true);
        defaultAxios.get("recipe/get-user-recipe/inx-pagination", {
                        params:{
                            userNickName:userNickName,
                            dateInx:recipeCache.cachedData.dateInx,
                            size:paramOption?.size||9
                        }
                    })
                    .then((res)=>{
                        const fetchedData = res.data as IndexPagenation<Recipe[], string>;
                        setRecipeCache({
                            cacheId:cacheKey.user_feed_recipe_key + userNickName,
                            cachedData:{
                                data:    fetchedData.data,
                                dateInx: fetchedData.index,
                                isEnd:   fetchedData.isEnd
                            }
                        });
                        setIsLoading(false);
                    });
    }, [toggle])

    return [recipeCache, ()=>refetcher(), isLoading]
}   