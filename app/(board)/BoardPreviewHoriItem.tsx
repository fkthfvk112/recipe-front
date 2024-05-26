import React from "react";
import { BoardPreview } from "../(type)/board";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

function BoardPreviewHoriItem({boardPreview}:{boardPreview:BoardPreview}){

    return(
        <div onClick={()=>{}} className="w-full flex flex-col mt-2 p-3 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <div className="w-full">
                <h1>{boardPreview.boardName}</h1>
                <p dangerouslySetInnerHTML={{__html:boardPreview.content}}/>
            </div>
            <div className="flex items-center justify-start text-sm mt-6 ">
                <div className='flex'>
                    <svg width="40" height="23" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="13" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                    <circle cx="10" cy="11" r="3" fill="black"/>
                    <circle cx="26" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                    <circle cx="23" cy="11" r="3" fill="black"/>
                    </svg>
                    {boardPreview.viewCnt}
                </div>
                <div className='ms-2'>
                    <FavoriteIcon/>
                    <span className='ms-1'>{boardPreview?.heartCnt}</span>
                </div>
                <div className='ms-2'>
                    <CommentIcon/>
                    <span className='ms-1'>{boardPreview?.reviewCnt}</span>
                </div>
            </div>
        </div>
    )
}


export default React.memo(BoardPreviewHoriItem);