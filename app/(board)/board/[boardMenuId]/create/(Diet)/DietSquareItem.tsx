"use client"

import { truncateString } from "@/app/(utils)/StringUtil";
import { DietDay } from "@/app/(type)/diet";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';

import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "@/app/(commom)/Hook/useWindowSize";

//내 피드 -> 내 식단에서 사용
function DietSquareItem({dietDay}:{dietDay:DietDay}){
    const windowSize = useWindowSize();
    const [containerWidth, setContinerWidth] = useState<number>(200);

    const containerRef = useRef<HTMLLIElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);
    const memoRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(containerRef.current){
            setContinerWidth(containerRef.current.clientWidth);
        }
    }, [windowSize])

    useEffect(()=>{
        if(containerWidth < 170 && containerWidth >= 120){
            if(textContainerRef.current && dateRef.current && memoRef.current && containerRef.current){
                textContainerRef.current.style.fontSize = '0.7rem';
                dateRef.current.style.fontSize = '10px';
                memoRef.current.style.fontSize = '0.7rem';
                containerRef.current.style.padding = '0.5rem';
            }
        }
        else if(containerWidth < 120){
            if(textContainerRef.current && dateRef.current && memoRef.current && containerRef.current){
                textContainerRef.current.style.fontSize = '0.5rem';
                dateRef.current.style.fontSize = '7px';
                memoRef.current.style.fontSize = '0.5rem';
                containerRef.current.style.padding = '0.3rem';
            }
        }
        else{
            if(textContainerRef.current && dateRef.current && memoRef.current && containerRef.current){
                textContainerRef.current.style.fontSize = '1rem';
                dateRef.current.style.fontSize = '1rem';
                memoRef.current.style.fontSize = '1rem';
                containerRef.current.style.padding = '0.75rem';
            }
        }
    }, [containerWidth])
    
    return (
        <li ref={containerRef} className="min-w-[80px] min-h-[80px] aspect-square flex flex-col p-3 border border-[#e1e1e1] rounded-md hover:bg-[#e1e1e1] cursor-pointer">
            <div ref={textContainerRef} className="relative w-full text-center text-[1rem]">
                {
                    (!dietDay?.isPublic)&&
                    <LockIcon className="absolute -left-6 -top-8 w-[30px] h-[30px]"/>
                }
                <h2>{dietDay?.title&&truncateString(dietDay.title, 8)}</h2>
            </div>
            <div>
                <CalendarMonthIcon sx={{ width: 15, height: 15 }} className='me-1'/>
                <span ref={dateRef}>{dietDay.dietDate}</span>
            </div>
            <div ref={memoRef} className="h-full text-start mt-1 top-line">
                {dietDay?.memo && truncateString(dietDay?.memo, 25)}
            </div>
        </li>
    )
}

export default React.memo(DietSquareItem);
