"use client"

import React, { useEffect, useRef, useState } from "react";
import { BoardPreview } from "../(type)/board";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { truncateString } from "../(utils)/StringUtil";
import Link from "next/link";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

function BoardPreviewHoriItem({boardPreview}:{boardPreview:BoardPreview}){
    const [containerWidth, setContinerWidth] = useState<number>(200);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(containerRef.current){
            setContinerWidth(containerRef.current.clientWidth);
        }
    }, [])
    return(
        <Link href={`/board/${boardPreview.boardMenuId}/detail/${boardPreview.boardId}`} className="w-full flex flex-col mt-2 p-3 shadow-sm border bg-white border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <li className="w-full">
                <div ref={containerRef} className="w-full">
                    <h1>{truncateString(boardPreview.boardName, containerWidth/16)}</h1>
                    <p className="whitespace-pre-wrap h-[40px] overflow-y-hidden text-[14px]">{truncateString(boardPreview.content, containerWidth/14)}</p>
                    {/* <p dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(truncateString(boardPreview.content, 30))}}/> */}
                </div>
                <section className="flex items-center justify-start text-sm mt-2 text-[#3b3b3b]">
                    <div className="flex justify-center items-center">
                        <svg width="28" height="15" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="6" fill="transparent" stroke="black" stroke-width="2"/>
                        <circle cx="5" cy="7" r="2" fill="black" />
                        <circle cx="19" cy="7" r="6" fill="transparent" stroke="black" stroke-width="2"/>
                        <circle cx="16.5" cy="7" r="2" fill="black"/>
                        </svg>
                        <span className="text-[12px] ms-[3px]">{boardPreview.viewCnt}</span>
                    </div>
                    <div className="flex justify-center items-center">
                    <div className="ms-2 flex justify-center items-center">
                        <BookmarkAddedIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{boardPreview?.heartCnt}</span>
                    </div>
                    <div className="ms-2 flex justify-center items-center">
                        <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{boardPreview?.reviewCnt}</span>
                    </div>
                    </div>
                </section>
            </li>
        </Link>
    )
}


export default React.memo(BoardPreviewHoriItem);