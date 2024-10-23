"use client"

import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { FridgeIdNameDesc } from "../(type)/fridge";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { truncateString } from "../(utils)/StringUtil";
import Link from "next/link";
import TitleDescription from "../(commom)/Component/TitleDescription";

export default function Fridge(){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fridgeDate, setFridgeDate] = useState<FridgeIdNameDesc[]>([]);

    useEffect(()=>{
        setIsLoading(true);
        axiosAuthInstacne.get("fridge/my")
            .then((res)=>{
                setFridgeDate(res.data);
                setIsLoading(false);
            })
        
    }, [])

    const fridgeCompSkeleton = [1, 2, 3, 4, 5, 6].map((fridge, inx)=>
        <div key={inx} className="aspect-square shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2 overflow-hidden text-ellipsis bg-[#e1e1e1]">
            
        </div>
    )

    const fridgeComp = fridgeDate.map((fridge, inx)=>
        <Link href={`/fridge/${fridge.fridgeId}`} key={inx} className="aspect-square shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2 overflow-hidden text-ellipsis">
            <h1 className="overflow-hidden text-ellipsis">{fridge.fridgeName}</h1>
            <p>{truncateString(fridge.description, 20)} </p>
        </Link>
    )

    return (
        <>
        <TitleDescription title={`나의 냉장고`} desc={'식재료를 저장하고, 관리하고, 낭김없이 사용해요.'}/>
        <div className="defaultInnerContainer flex flex-col justify-start items-center">
            <section className="w-full max-w-[520px] min-w-[320px] grid grid-cols-3 p-3">
                {isLoading?fridgeCompSkeleton:fridgeComp}
                {!isLoading&&
                <Link href={"/fridge/create"} className="aspect-square flex justify-center items-center shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2">
                    <h1 className="overflow-hidden text-ellipsis text-nowrap">
                        <AddIcon sx={{
                            width:"50px",
                            height:"50px"
                        }}/>
                    </h1>
                </Link>
                }
            </section>
        </div>
        </>
    )
}