"use client"

import AdminMenuItem from "./AdminMenuItem"

export default function AdminNav(){

    const adminMenu = [
        {eng:"ingredient", kor:"재료 등록"},
        {eng:"ingredient-redis", kor:"재료 확인"},
        {eng:"fridge-img", kor:"냉장고 식재료 등록"},
        {eng:"user-list", kor:"유저 목록"},
        {eng:"access-log", kor:"액세스 로그"},
    ];

    const baseMenu = adminMenu.map((menu, inx)=>
        <AdminMenuItem key={inx} adminMenuName={menu.eng} adminMenuKor={menu.kor}/>)
        
    return (
        <div className="w-full flex justify-between items-center bg-white p-2 h-[55px] overflow-x-scroll scroll">
            <div className="h-full w-full flex justify-start items-center overflow-x -scroll overflow-y-hidden no-scroll">
                {baseMenu}
            </div>
        </div>)
}
