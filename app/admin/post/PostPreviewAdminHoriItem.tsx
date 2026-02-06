"use client"

import { truncateString } from "@/app/(utils)/StringUtil";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function PostPreviewAdminHoriItem({postPreview}:{postPreview:Post}){
    const [containerWidth, setContinerWidth] = useState<number>(200);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(containerRef.current){
            setContinerWidth(containerRef.current.clientWidth);
        }
    }, [])
    
    return(
        <Link href={`/admin/post/${postPreview.postId}`} className="w-full flex flex-col mt-2 p-3 shadow-sm border bg-white border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <li className="w-full">
                <div ref={containerRef} className="w-full">
                    <h1>{truncateString(postPreview.title, containerWidth/16)}</h1>
                    <p className="whitespace-pre-wrap h-[40px] overflow-y-hidden text-[14px]">{truncateString(postPreview.content, containerWidth/14)}</p>
                </div>
                <section className="flex items-center justify-start text-sm mt-2 text-[#3b3b3b]">
                    <div className="flex justify-center items-center">
                        <svg width="28" height="15" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="6" fill="transparent" stroke="black" strokeWidth="2"/>
                        <circle cx="5" cy="7" r="2" fill="black" />
                        <circle cx="19" cy="7" r="6" fill="transparent" stroke="black" strokeWidth="2"/>
                        <circle cx="16.5" cy="7" r="2" fill="black"/>
                        </svg>
                        <span className="text-[12px] ms-[3px]">{postPreview.viewCnt}</span>
                    </div>
                    <div className="flex justify-center items-center ms-3">
                    <span className={`
                        flex justify-center items-center
                        w-fit px-3 m-1 mt-2
                        text-white rounded-md font-bold
                        whitespace-nowrap relative
                        ${postPreview.draft ? "bg-[#a1a1a1]" : "bg-green-600"}
                    `}
                    >                            
                        {postPreview.draft?"임시":"게시됨"}
                        </span>
                    </div>
                </section>
            </li>
        </Link>
    )
}

export default React.memo(PostPreviewAdminHoriItem);