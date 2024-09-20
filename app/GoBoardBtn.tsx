"use client"
import React from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { usePathname, useRouter } from 'next/navigation';
import { useResetRecoilState } from 'recoil';
import { boardCacheSelectorAtom } from './(recoil)/boardCacheSelector';
import { scrollYCacheAtom } from './(recoil)/scrollYCacheSelector';
import { cacheKey } from './(recoil)/cacheKey';

export default function GoBoardBtn() {
    const router = useRouter();
    const pathname = usePathname()

    const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + 1));
    const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + 1));
    
    const goBoard = () => {
        if (pathname === "/board/1") return; 
        boardCacheReset();
        boardScrollYReset();
        router.push("/board/1");
    };

    return (
        <div className='cursor-pointer' onClick={goBoard}>
            <div className="flex flex-col justify-center items-center">
                <LibraryBooksIcon sx={{ width: '30px', height: '30px' }} />
                <p>게시판</p>
            </div>
        </div>
    );
}
