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
        const urlOrg = currentUrl.slice(0, currentUrl.lastIndexOf("/")) + "/";
        const queryStr = queryStrArr.length > 0 ? queryStrArr.join('&') : '';

        setIsLoading(true);
        router.push(urlOrg + queryStr);
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
                            className="flex justify-center items-center whitespace-nowrap bg-[#e1e1e1] text-sm p-1 ps-2 pe-2 ms-1 me-1 rounded-xl">
                            <span className="">{queryConvert[query.name]}</span>:
                            <span className="ms-1">{decodeURIComponent(value)}</span>
                            <ClearIcon sx={{ width: "20px", height: "20px" }} />    
                        </span>
                    ));
                }
            }).filter(ele => ele);
    }, [queryMap, queryConvert]);

    return (
        <div className="flex justify-between w-full max-w-[1024px]">
            {
            !isLoading?
            <>
            <section className="flex flex-row overflow-x-scroll no-scroll">
                {queryBtns}
            </section>
            <section className="w-[150px] px-2">
                <select
                    name="sorting"
                    value={getSortingCon()}
                    onChange={(evt) => {
                        setSortingCon(evt.target.value);
                    }}
                    className="rounded p-2"
                    >
                    <option value="POPULARITY">인기순</option>
                    <option value="LATEST">최신순</option>
                    <option value="LIKE_MANY">좋아요 많은순</option>
                    <option value="LIKE_FEW">좋아요 적은순</option>
                    <option value="VIEW_MANY">조회수 많은순</option>
                    <option value="VIEW_FEW">조회수 적은순</option>
                </select>
            </section>
            </>:<div className="flex justify-center w-full"><CircularProgress /></div>
            }
        </div>
    )
}

export default React.memo(RecipeConditionBtns);