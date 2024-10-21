"use client"

import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { containChosingJungsungJongsung, isChosung, isJungsung } from "@/app/(utils)/StringUtil";
import { useEffect, useState } from "react"



export default function IngreRecommandInput({inputStyleStr, containerStyleStr, placeholderStr, dataSettingCallback, titleVideCnt}:{inputStyleStr?:string, containerStyleStr?:string, placeholderStr?:string, dataSettingCallback?:(data:any)=>any, titleVideCnt?:number}){
    const [ingre, setIngre] = useState<string>("");
    const [recommendTermList, setRecommendTermList] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [lastSearchedTerm, setLastSearchedTerm] = useState<string>("");

    useEffect(()=>{
        if(dataSettingCallback){
            dataSettingCallback(ingre);
        }

        if(ingre.length === 0){
            setRecommendTermList([]);
            setLastSearchedTerm("");
            return;
        }

        if(ingre.length > 0 && !containChosingJungsungJongsung(ingre) && ingre !== lastSearchedTerm){
            defaultAxios.get("ingre-list/recommend/redis",{
                params:{
                    searchingTerm:ingre
                }
            })
            .then((res)=>{
                console.log(res.data);
                setLastSearchedTerm(ingre)
                if(res.data?.length > 0){
                    setRecommendTermList(res.data);
                }
            })
        }

    }, [ingre, isFocused])

    useEffect(()=>{
        if(titleVideCnt){
            setIngre("");
        }
    }, [titleVideCnt])

    const recommendList = isFocused && recommendTermList.filter((ele)=>ele !== ingre).map((term, inx)=>{
        return (
            <div key={inx} onMouseDown={()=>{
                setIngre(term)}} className="w-full hover:bg-[#e1e1e1]">
                {term}
            </div>
        )
    })

    return (
        <div className={`flex-col justify-start items-center flex-wrap w-full ${containerStyleStr}`}>
            <input type="text" className={`${inputStyleStr}`} value={ingre}
                maxLength={20} 
                placeholder={`${placeholderStr||""}`}
                onChange={(e)=>{
                setIngre(e.target.value);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {setIsFocused(false)}}
            />
            {
            recommendList&&recommendList.length > 0 &&
            <div className="relative ">
                <div className="border border-gray-200 w-full absolute top-0 z-10 bg-white rounded-b-lg pb-1.5 shadow-md">
                    {recommendList}
                </div>
            </div>
            }
        </div>
    )
}