"use client"

import { usePathname, useRouter } from "next/navigation";

//경로에 포함된 문자열을 기준으로 색 선택
export default function AdminMenuItem({adminMenuName, adminMenuKor}:{adminMenuName:string, adminMenuKor:string}){
    const router = useRouter();
    const urlPath = usePathname();
    const urlArr:string[] = urlPath.split("/");

    const goBoardList = ()=>{
        router.push(`/admin/${adminMenuName}`)
    }

    return (
        <div onClick={goBoardList} className="text-nowrap cursor-pointer">
            <span className={`${urlArr.includes(adminMenuName) ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>
                {adminMenuKor}
            </span>
        </div>
    )
}