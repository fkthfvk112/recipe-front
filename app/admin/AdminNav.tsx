"use client"

import AdminMenuItem from "./AdminMenuItem"

export default function AdminNav({selectedMenu}:{selectedMenu:string}){

    const adminMenu = ["ingredient"]

    const baseMenu = adminMenu.map((menuName, inx)=>
        <AdminMenuItem key={inx} adminMenuName={menuName} selectedMenuName={selectedMenu}/>)
        
    return (
        <div className="w-full flex justify-between items-center bg-white p-2 h-[55px] overflow-x-scroll scroll">
            <div className="h-full w-full flex justify-start items-center overflow-x -scroll overflow-y-hidden no-scroll">
                {baseMenu}
            </div>
        </div>)
}
