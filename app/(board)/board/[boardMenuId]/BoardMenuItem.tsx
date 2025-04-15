import { boardCacheSelectorAtom } from "@/app/(recoil)/boardCacheSelector";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import { scrollYCacheAtom } from "@/app/(recoil)/scrollYCacheSelector";
import { usePathname, useRouter } from "next/navigation";
import {  useResetRecoilState } from "recoil";

export default function BoardMenuItem({boardMenuId, boardMenuName, selectedMenuId}:{boardMenuId:string, boardMenuName:string, selectedMenuId:string}){
    const router = useRouter();
    const pathname = usePathname(); 
    const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + boardMenuId));
    const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + boardMenuId));
    

    const goBoardList = ()=>{
        if (pathname === `/board/${boardMenuId}`) return;
        boardCacheReset();
        boardScrollYReset();
        router.push(`/board/${boardMenuId}`)
    }

    return (
        <div onClick={goBoardList} className="text-nowrap cursor-pointer">
            <span className={`${Number(selectedMenuId) === Number(boardMenuId) ? 'bg-[#fb8500]' : 'bg-[#d9d9d9]'} p-1 ps-2 pe-2 ms-1 me-1 rounded-xl`}>
                {boardMenuName}
            </span>
        </div>
    )
}