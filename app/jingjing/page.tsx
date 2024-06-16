"use client"

import { useState } from "react"
import { getRandomElement, jingdatas } from "./data";

export default function(){
    const [seeData, setSeeData] = useState<string>("");
    const clickBtn = ()=>{
        const randData:string = getRandomElement(jingdatas);
        setSeeData(randData);
    }

    return (
    <div className="flex flex-col justify-center items-center w-full min-h-lvh">
        <div className="flex justify-center items-center h-[300px] w-full">{seeData}</div>
        <div className="mt-6">
            <button onClick={clickBtn} className="greenBtn">클릭</button>
        </div>
    </div>
    )
}