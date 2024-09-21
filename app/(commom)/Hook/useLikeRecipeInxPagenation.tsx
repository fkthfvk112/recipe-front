import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { CacheData } from "@/app/(recoil)/boardCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { FeedRecipeCacheData, userFeedRecipeCacheAtom, userFeedRecipeCacheSelectorAtom } from "@/app/(recoil)/userFeedRecipeCacheSelector";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { useRecoilState } from "recoil";


interface useLikeRecipeInxPagenationProp{
    paramOption?:{
        size?:number;
    }
}

export const useLikeRecipeInxPagenation = ({paramOption}:useLikeRecipeInxPagenationProp):[CacheData<FeedRecipeCacheData>, DispatchWithoutAction, boolean]=>{
    const [recipeCache, setRecipeCache] = useRecoilState(
        userFeedRecipeCacheSelectorAtom(cacheKey.user_feed_like_recipe_key + 'myFeedRecipe')
    );
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(recipeCache.cachedData.isEnd) return;
        setIsLoading(true);
        axiosAuthInstacne.get('like/recipe/like-list/inx-pagination', {
                        params:{
                            dateInx:recipeCache.cachedData.dateInx,
                            size:paramOption?.size||9
                        }
                    })
                    .then((res)=>{
                        const fetchedData = res.data as IndexPagenation<Recipe[], string>;
                        setRecipeCache({
                            cacheId:cacheKey.user_feed_like_recipe_key + 'myFeedRecipe',
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