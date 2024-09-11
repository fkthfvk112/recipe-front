import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { BoardCacheData, boardCacheSelectorAtom, CacheData, cacheKey } from "@/app/(recoil)/boardCacheSelector";
import { Board, BoardPreview } from "@/app/(type)/board";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import axios from "axios";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { useRecoilState } from "recoil";


interface boadInxPagenationProp{
    boardMenuId:number;
    paramOption?:{
        sotringCon?:string;
        size?:number;
    }
}

export const useBoardInxPagenation = ({boardMenuId, paramOption}:boadInxPagenationProp):[CacheData<BoardCacheData>, DispatchWithoutAction, boolean]=>{
    const [boardCache, setBoardCache] = useRecoilState(
        boardCacheSelectorAtom(cacheKey.board_key + boardMenuId)
    );
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(boardCache.cachedData.isEnd) return;
        setIsLoading(true);
        defaultAxios.get("board/previews/inx-pagination", {
                        params:{
                            sortingCon:paramOption?.sotringCon||"LATEST",
                            boardMenuId:boardMenuId,
                            dateInx:boardCache.cachedData.dateInx,
                            size:paramOption?.size||10
                        }
                    })
                    .then((res)=>{
                        const fetchedData = res.data as IndexPagenation<BoardPreview[], string>;
                        console.log("res", res.data);
                        setBoardCache({
                            cacheId:cacheKey.board_key + boardMenuId,
                            cachedData:{
                                data:    fetchedData.data,
                                dateInx: fetchedData.index,
                                isEnd:   fetchedData.isEnd
                            }
                        });
                        setIsLoading(false);
                    });
    }, [toggle])

    return [boardCache, ()=>refetcher(), isLoading]
}   