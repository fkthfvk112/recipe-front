import { atomFamily, DefaultValue, selectorFamily } from "recoil";
import { CacheData } from "./boardCacheSelector";
import { DietDay } from "../(type)/diet";

export const defaultCacheData ={
    cacheId:"",
    cachedData:{
        data:[],
        dateInx:"",
        isEnd:false
    }
}


export interface FeedDietCacheData{
    data:DietDay[];
    dateInx:string;
    isEnd:boolean;
    scrollX?:number;
    scrollY?:number;
}


export const userFeedDietCacheAtom = atomFamily<CacheData<FeedDietCacheData>, string>({
    key:"userFeedDietKey",
    default: (userNickName:string)=>(defaultCacheData)
})

/**시간 desc순 */
export const userFeedDietCacheSelectorAtom = selectorFamily<CacheData<FeedDietCacheData>, string>({
    key: "userFeedDietCacheSelector",
    get: (userNickName) => ({ get }) => get(userFeedDietCacheAtom(userNickName)),
    set: (userNickName) => ({ set, get }, nextData:CacheData<FeedDietCacheData>|DefaultValue) => {
        if (nextData instanceof DefaultValue) {
            set(userFeedDietCacheAtom(userNickName), defaultCacheData);
            return;
          }

        const preRecipeCache: CacheData<FeedDietCacheData> = get(userFeedDietCacheAtom(userNickName));

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

        set(userFeedDietCacheAtom(userNickName), willCacheData);
    }
});