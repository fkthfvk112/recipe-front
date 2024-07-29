"use client"

import { BoardMenu } from "@/app/(type)/menu";
import Link from "next/link";
import React from "react";
function BoardNav({baseMenuList, selectedMenu}:{baseMenuList:BoardMenu[],  selectedMenu:number}){

    const baseMenu = baseMenuList.map((menu, inx)=>
        <Link key={inx} href={`/board/${menu.boardMenuId}`}>
                <span className={`${Number(selectedMenu) === Number(menu.boardMenuId) ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>
                    {menu.menuName}
                </span>
        </Link>)
        
    return (
        <div className="w-full flex justify-start items-end bg-white p-4 h-[70px] overflow-x-scroll scroll">
            {baseMenu}
        </div>)
}

export default React.memo(BoardNav);