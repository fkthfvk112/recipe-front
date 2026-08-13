"use client"

import React, { useEffect, useMemo, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

const queryConvert: { [key: string]: string } = {
    recipeName: "레시피명",
    createdDate: "작성일",
    cookMethod: "조리방법",
    ingredientNames: "재료명",
    servingsMin: "최소양",
    servingsMax: "최대양",
    cookCategory: "카테고리",
};

const sortingConvert:{[key:string]:string} = {
    sortingCondition:"정렬기준"
}

function RecipeConditionBtns() {
    const [queryMap, setQueryMap] = useState<Map<string, string[]>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(false); //have to 스켈레톤으로 변경할 방법 찾기 loading.tsx발동시키기
    const currentUrl = usePathname();
    const router = useRouter();

    const delCondition = (conditionKey:string, conditionName:string)=>{
        const queryStrArr:string[] = [];// ["key=value", "key2=value2"]

        const conditionMap = new Map(queryMap);
        Array.from(conditionMap, ([key, value])=>({name:key, value})).forEach((query)=>{
            query.value.forEach((val)=>{
                if(query.name !== conditionKey || val !== conditionName){
                    queryStrArr.push(`${query.name}=${val}`);
                }
            })
        })
        
        const urlOrg = currentUrl.slice(0, currentUrl.lastIndexOf("/")) + "/";
        const queryStr = queryStrArr.length > 0 ? queryStrArr.join('&') : '';
    
        setIsLoading(true);
        router.push(urlOrg + queryStr);
    }

    const getSortingCon = () => {
        const conditionMatch = currentUrl.match(/sortingCondition=([^&]*)/);
    
        return conditionMatch ? conditionMatch[1] : "POPULARITY";
    }

    const setSortingCon = (sortingCon: string) => {
        const queryStrArr:string[] = [];// ["key=value", "key2=value2"]

        const conditionMap = new Map(queryMap);
        Array.from(conditionMap, ([key, value])=>({name:key, value})).forEach((query)=>{
            query.value.forEach((val)=>{
                if(query.name !== "sortingCondition"){
                    queryStrArr.push(`${query.name}=${val}`);
                }
            })
        })

        queryStrArr.push(`sortingCondition=${sortingCon}`);
        const urlOrg = currentUrl.slice(0, currentUrl.lastIndexOf("/"));
        const urlNotIncludePage = urlOrg.slice(0, urlOrg.lastIndexOf("/")) + "/1/";
        const queryStr = queryStrArr.length > 0 ? queryStrArr.join('&') : '';

        setIsLoading(true);
        router.push(urlNotIncludePage + queryStr);
    };

    useEffect(() => {
        setIsLoading(false);
        if (!currentUrl) return;
        const last = currentUrl.split("/").at(-1);
        const queryStrings = last?.split("&");

        const map = new Map();
        queryStrings?.forEach(query => {
            const nameVal = query.split("=");
            if (nameVal.length === 2) {
                const existingValues = map.get(nameVal[0]) || [];
                map.set(nameVal[0], [...existingValues, nameVal[1]]);
            }
        });

        setQueryMap(map);
    }, [currentUrl]);

    const queryBtns = useMemo(() => {
        return Array.from(queryMap, ([key, value]) => ({ name: key, value }))
            .map((query) => {
                const hasKeyWithSubstring = Object.keys(queryConvert).some(key => key.includes(query.name));
                if (hasKeyWithSubstring) {
                    const queryString = queryMap.get(query.name);
                    return queryString?.map((value, inx) => (
                        <span key={`${value}${inx}`} onClick={() => { delCondition(query.name, value) }}  
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-mugin-primary border border-orange-100 rounded-full text-xs font-semibold hover:bg-orange-100 hover:border-orange-200 transition-all cursor-pointer shadow-sm select-none mx-1 my-0.5">
                            <span className="opacity-80">{queryConvert[query.name]}</span>:
                            <span className="font-bold">{decodeURIComponent(value)}</span>
                            <ClearIcon sx={{ 
                              width: "14px", 
                              height: "14px", 
                              marginLeft: "2px", 
                              opacity: 0.7,
                              transition: "all 0.2s",
                              '&:hover': {
                                color: "#ef4444 !important",
                                transform: "scale(1.2)"
                              }
                            }} />    
                        </span>
                    ));
                }
            }).filter(ele => ele);
    }, [queryMap, queryConvert]);

    return (
        <div className="flex justify-between items-center w-full max-w-[1024px] px-4 sm:px-2">
            {
            !isLoading?
            <>
            <section className="flex flex-row flex-wrap overflow-x-auto no-scroll flex-grow items-center">
                {queryBtns}
            </section>
            <section className="shrink-0 pl-2">
                <select
                    name="sorting"
                    value={getSortingCon()}
                    onChange={(evt) => {
                        setSortingCon(evt.target.value);
                    }}
                    className="mugin-select py-1.5 px-3 rounded-full text-xs font-bold text-gray-700 bg-white border border-gray-200 shadow-sm focus:border-mugin-primary focus:ring-1 focus:ring-orange-100"
                    >
                    <option value="POPULARITY">인기순</option>
                    <option value="LATEST">최신순</option>
                    <option value="LIKE_MANY">좋아요 많은순</option>
                    <option value="LIKE_FEW">좋아요 적은순</option>
                    <option value="VIEW_MANY">조회수 많은순</option>
                    <option value="VIEW_FEW">조회수 적은순</option>
                </select>
            </section>
            </>:<div className="flex justify-center w-full py-1"><CircularProgress size={24} sx={{ color: "#FF7043" }} /></div>
            }
        </div>
    )
}

export default React.memo(RecipeConditionBtns);