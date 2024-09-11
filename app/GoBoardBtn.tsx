"use client"
import React from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useRouter } from 'next/navigation';
import { useResetRecoilState } from 'recoil';
import { boardCacheSelectorAtom, cacheKey } from './(recoil)/boardCacheSelector';
import { scrollYCacheAtom } from './(recoil)/scrollYCacheSelector';

export default function GoBoardBtn() {
    const router = useRouter();
    const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + 1));
    const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + 1));
    
    const goBoard = () => {
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
