import { atomFamily, selectorFamily } from "recoil";
import { BoardPreview } from "../(type)/board";

interface CacheData<T>{
    cacheId:string;
    cachedData?:T;
}

export interface BoardCacheData{
    data:BoardPreview[];
    dateInx:string;
    isEnd:boolean;
    scrollX?:number;
    scrollY?:number;
}

export enum cacheKey{
    board_key = 'board_key_',

}

export const boardCacheAtom = atomFamily<CacheData<BoardCacheData>, string>({
    key:"boardCache",
    default: (menuId:string)=>({
        cacheId:menuId,
        cachedData:{
            data:[],
            dateInx:"",
            isEnd:false
        }
    })
})

export const boardCacheSelectorAtom = selectorFamily<CacheData<BoardCacheData>, string>({
    key: "boardCacheSelector",
    get: (menuId) => ({ get }) => get(boardCacheAtom(menuId)),
    set: (menuId) => ({ set }, newCacheData) => {
            set(boardCacheAtom(menuId), newCacheData);
    },
});