"use client"

import { useRouter } from "next/navigation";


export default function AdminMenuItem({adminMenuName, selectedMenuName}:{adminMenuName:string, selectedMenuName:string}){
    const router = useRouter();
    
    const goBoardList = ()=>{
        router.push(`/admin/${adminMenuName}`)
    }

    return (
        <div onClick={goBoardList} className="text-nowrap cursor-pointer">
            <span className={`${selectedMenuName === adminMenuName ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>
                {adminMenuName}
            </span>
        </div>
    )
}