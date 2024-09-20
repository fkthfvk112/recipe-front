import { atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Recipe } from "../(recipe)/types/recipeType";
import { CacheData } from "./boardCacheSelector";

export const defaultCacheData ={
    cacheId:"",
    cachedData:{
        data:[],
        dateInx:"",
        isEnd:false
    }
}


export interface FeedRecipeCacheData{
    data:Recipe[];
    dateInx:string;
    isEnd:boolean;
    scrollX?:number;
    scrollY?:number;
}


export const userFeedRecipeCacheAtom = atomFamily<CacheData<FeedRecipeCacheData>, string>({
    key:"userFeedRecipeKey",
    default: (userNickName:string)=>(defaultCacheData)
})

/**시간 desc순 */
export const userFeedRecipeCacheSelectorAtom = selectorFamily<CacheData<FeedRecipeCacheData>, string>({
    key: "userFeedRecipeCacheSelector",
    get: (userNickName) => ({ get }) => get(userFeedRecipeCacheAtom(userNickName)),
    set: (userNickName) => ({ set, get }, nextData:CacheData<FeedRecipeCacheData>|DefaultValue) => {
        if (nextData instanceof DefaultValue) {
            set(userFeedRecipeCacheAtom(userNickName), defaultCacheData);
            return;
          }

        const preRecipeCache: CacheData<FeedRecipeCacheData> = get(userFeedRecipeCacheAtom(userNickName));

        //인덱스가 더 작은 값이 들어오면 저장하지 않음
        const preInx = new Date(preRecipeCache.cachedData.dateInx);
        const postInx = new Date(nextData.cachedData.dateInx);
        if(preInx <= postInx){
            return;
        }
        if(preRecipeCache.cachedData.isEnd){
            return;
        }

        const willCacheData = JSON.parse(JSON.stringify(preRecipeCache));

        // 기존 데이터에 새 데이터 추가
        willCacheData.cachedData.data = [
            ...willCacheData.cachedData.data, 
            ...nextData.cachedData.data
        ];
        willCacheData.cachedData.dateInx = nextData.cachedData.dateInx;
        willCacheData.cachedData.isEnd = nextData.cachedData.isEnd;

        set(userFeedRecipeCacheAtom(userNickName), willCacheData);
    }
});