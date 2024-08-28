"use client"

import { BoardMenu } from "@/app/(type)/menu";
import Link from "next/link";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';

function BoardNav({baseMenuList, selectedMenu}:{baseMenuList:BoardMenu[],  selectedMenu:number}){

    const baseMenu = baseMenuList.map((menu, inx)=>
        <Link className="text-nowrap" key={inx} href={`/board/${menu.boardMenuId}`}>
            <span className={`${Number(selectedMenu) === Number(menu.boardMenuId) ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>
                {menu.menuName}
            </span>
        </Link>)
        
    return (
        <div className="w-full flex justify-between items-center bg-white p-2 h-[55px] overflow-x-scroll scroll">
            <div className="h-full w-full flex justify-start items-center overflow-x-scroll overflow-y-hidden no-scroll">
                {baseMenu}
            </div>
            <Link className="w-12" href="/board/search">
                <SearchIcon sx={{height:"38px", width:"38px"}}/>
            </Link>
        </div>)
}

export default React.memo(BoardNav);