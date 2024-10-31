"use client"

import Link from "next/link"
import CreateIcon from '@mui/icons-material/Create';
import React, { useState } from "react";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import usePreventGoBack from "../Hook/usePreventGoBack";

interface btn{
    name:string,
    url:string
}

const additionalItemCss = "bg-white m-[4px] rounded-3xl p-2 px-5 text-center"


export function AdditionalBtn({additionalBtns}:{additionalBtns:btn[]}){
    const {layoutMargin} = useResponsiveDesignCss();
    const [plusBtnClicked, setPlusBtnClicked] = useState<boolean>(false);

    usePreventGoBack({callback:()=>{setPlusBtnClicked(false)}, useCondition:plusBtnClicked})


    const clickPlusBtn = ()=>{
        setPlusBtnClicked((prev)=>!prev);

    }

    const additionalBtnComps = additionalBtns.map((btn, inx)=>
        <Link href={btn.url} key={inx} className={`${additionalItemCss}`}>
            {btn.name}
        </Link>
    )


    return (
        <>
        {
        plusBtnClicked&&
        <div onClick={()=>setPlusBtnClicked(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">

        </div>
        }

        <div className={`fixed bottom-6 right-6 direction-right ${layoutMargin} z-50`}>
            {
            plusBtnClicked&&
            <div className="grid grid-cols-2">
                {additionalBtnComps}
            </div>
            }
            <button onClick={clickPlusBtn} className={`${plusBtnClicked?"bg-white":"bg-[#38c54b]"} border-none rounded-full w-[60px] h-[60px]`}>
                {plusBtnClicked ?<ClearIcon sx={{width:"25px", height:"25px"}}/>:<AddIcon sx={{width:"25px", height:"25px"}}/>}
            </button>
        </div>
        </>
    )
}

// export default React.memo(WriteBtn);