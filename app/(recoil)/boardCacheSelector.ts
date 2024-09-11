import { atomFamily, DefaultValue, selectorFamily } from "recoil";
import { BoardPreview } from "../(type)/board";

export interface CacheData<T>{
    cacheId:string;
    cachedData:T;
}

export interface BoardCacheData{
    data:BoardPreview[];
    dateInx:string;
    isEnd:boolean;
    scrollX?:number;
    scrollY?:number;
}

export enum cacheKey{
    board_key = 'board_key#',

}

export const defaultBoadCacheData ={
    cacheId:"",
    cachedData:{
        data:[],
        dateInx:"",
        isEnd:false
    }
}

export const boardCacheAtom = atomFamily<CacheData<BoardCacheData>, string>({
    key:"boardCache",
    default: (menuId:string)=>(defaultBoadCacheData)
})

/**시간 desc순 */
export const boardCacheSelectorAtom = selectorFamily<CacheData<BoardCacheData>, string>({
    key: "boardCacheSelector",
    get: (boardMenuId) => ({ get }) => get(boardCacheAtom(boardMenuId)),
    set: (boardMenuId) => ({ set, get }, nextData:CacheData<BoardCacheData>|DefaultValue) => {
        if (nextData instanceof DefaultValue) {
            set(boardCacheAtom(boardMenuId), defaultBoadCacheData);
            return;
          }

        const preBoardCache: CacheData<BoardCacheData> = get(boardCacheAtom(boardMenuId));

        //인덱스가 더 작은 값이 들어오면 저장하지 않음
        const preInx = new Date(preBoardCache.cachedData.dateInx);
        const postInx = new Date(nextData.cachedData.dateInx);
        if(preInx <= postInx){
            return;
        }
        if(preBoardCache.cachedData.isEnd){
            return;
        }

        const willCacheData = JSON.parse(JSON.stringify(preBoardCache));

        // 기존 데이터에 새 데이터 추가
        willCacheData.cachedData.data = [
            ...willCacheData.cachedData.data, 
            ...nextData.cachedData.data
        ];
        willCacheData.cachedData.dateInx = nextData.cachedData.dateInx;
        willCacheData.cachedData.isEnd = nextData.cachedData.isEnd;

        set(boardCacheAtom(boardMenuId), willCacheData);
    }
});