"use client"

import Link from "next/link"
import CreateIcon from '@mui/icons-material/Create';
import React from "react";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";

function WriteBtn({boardMenuId}:{boardMenuId:string}){
    const {layoutMargin} = useResponsiveDesignCss();

    return (
        <Link href={`/board/${boardMenuId}/create`} className={`fixed bottom-6 roundRreenBtn ${layoutMargin}`}>
            <CreateIcon sx={{width:"25px", height:"25px"}}/>
            <span className="ms-2">글쓰기</span>
        </Link>
    )
}

export default React.memo(WriteBtn);