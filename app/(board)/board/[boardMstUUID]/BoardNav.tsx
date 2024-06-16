"use client"

import Link from "next/link";
import React from "react";
function BoardNav({boardMstUUID}:{boardMstUUID:string}){

    console.log("로그", boardMstUUID);
    return (
        <div className="w-full bg-white p-2 overflow-x-scroll scroll">
            <Link href={`/board/${process.env.NEXT_PUBLIC_FREE_BOARD_UUID}`} >
                <span className={`${boardMstUUID === process.env.NEXT_PUBLIC_FREE_BOARD_UUID ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>자유</span>
            </Link>
            <Link href="/board/diet" >
                <span className={`${boardMstUUID === 'diet' ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>식단</span>
            </Link>
            <Link href="/board/loose-weight" >
                <span className={`${boardMstUUID === 'loose-weight' ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>다이어트</span>
            </Link>
        </div>)
}

export default React.memo(BoardNav);