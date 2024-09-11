import { boardCacheSelectorAtom, cacheKey } from "@/app/(recoil)/boardCacheSelector";
import { scrollYCacheAtom, scrollYCacheSelector } from "@/app/(recoil)/scrollYCacheSelector";
import { useRouter } from "next/navigation";
import {  useResetRecoilState } from "recoil";

export default function BoardMenuItem({boardMenuId, boardMenuName, selectedMenuId}:{boardMenuId:string, boardMenuName:string, selectedMenuId:string}){
    const router = useRouter();
    const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + boardMenuId));
    const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + boardMenuId));
    

    const goBoardList = ()=>{
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