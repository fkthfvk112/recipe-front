"use client"

import { Recipe } from "@/app/(recipe)/types/recipeType";
import { truncateString } from "@/app/(utils)/StringUtil";
import Image from "next/image";
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "@/app/(utils)/NumberUtil";
import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "@/app/(commom)/Hook/useWindowSize";

function RecipeSquareItem({ recipe }: { recipe: Recipe }) {
    const [containerWidth, setContinerWidth] = useState<number>(200);
    const windowSize = useWindowSize();

    const containerRef = useRef<HTMLLIElement>(null);
    const textContainerRef = useRef<HTMLElement>(null);
    const starRef = useRef<SVGSVGElement>(null);

    useEffect(()=>{
        if(containerRef.current){
            setContinerWidth(containerRef.current.clientWidth);
        }
    }, [windowSize])
    
    useEffect(()=>{
        if(containerWidth < 170 && containerWidth >= 120){
            if(textContainerRef.current && starRef.current){
                textContainerRef.current.style.fontSize = '0.6rem';
                textContainerRef.current.style.padding = '0.3rem';
                starRef.current.style.fontSize = '0.6rem';
                starRef.current.style.width = '1rem';
                starRef.current.style.height = '1rem';
            }
        } else if(containerWidth < 120){
            if(textContainerRef.current && starRef.current){
                textContainerRef.current.style.fontSize = '0.5rem';
                textContainerRef.current.style.padding = '0.2rem';
                starRef.current.style.fontSize = '0.5rem';
                starRef.current.style.width = '0.6rem';
                starRef.current.style.height = '0.6rem';
            }
        }
        else{
            if(textContainerRef.current && starRef.current){
                textContainerRef.current.style.fontSize = '1rem';
                textContainerRef.current.style.padding = '0.5rem';
                starRef.current.style.fontSize = '1rem';
                starRef.current.style.width = '2rem';
                starRef.current.style.height = '2rem';

            }
        }
    }, [containerWidth])

    return(
        <li ref={containerRef} className="min-w-[80px] min-h-[80px] aspect-square hover:bg-[#e1e1e1] cursor-pointer">
            <section className="h-[80%] w-full img-wrapper-square overflow-hidden rounded-t-md">
                <Image
                    className="inner-img"
                    src={recipe.repriPhotos[0]}
                    width={300}
                    height={300}
                    loading="lazy"
                    alt=""
                />
            </section>
            <section ref={textContainerRef} className="flex justify-start items-center p-2 border border-[#e1e1e1] rounded-b-md max-h-[20%]">
                <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {recipe.recipeName}
                </h1>
                <span className="flex-center font-bold mr-2 text-[#3b3b3b]">
                    <StarIcon ref={starRef} className="mb-1 fill-[#FFB701]"/>{recipe.reviewAvg?roundToNPlaces(recipe.reviewAvg, 2):"_"}
                </span>
            </section>
        </li>
    )
}

export default React.memo(RecipeSquareItem);