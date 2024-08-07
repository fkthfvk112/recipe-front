import { extractDate } from "@/app/(utils)/DateUtil";
import { truncateString } from "@/app/(utils)/StringUtil";
import { DietDay } from "@/app/(type)/diet";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';

import React from "react";

function DietVerticalItem({dietDay}:{dietDay:DietDay}){
    return (
        <div className="h-[170px] w-[170px] flex flex-col p-3 m-2 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1] cursor-pointer">
            <div className="relative w-full text-center">
                {
                    (!dietDay?.isPublic)&&
                    <LockIcon className="absolute -left-5 -top-6"/>
                }
                <h2>{dietDay?.title&&truncateString(dietDay.title, 8)}</h2>
            </div>
            <div>
                <CalendarMonthIcon sx={{ width: 15, height: 15 }} className='me-1'/>
                <span className='text-[12px]'>{dietDay.dietDate}</span>
            </div>
            <div className="h-full text-start mt-1 top-line">
                {dietDay?.memo && truncateString(dietDay?.memo, 25)}
            </div>
        </div>
    )
}

export default React.memo(DietVerticalItem);
