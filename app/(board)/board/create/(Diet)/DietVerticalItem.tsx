import { extractDate } from "@/app/(utils)/DateUtil";
import { truncateString } from "@/app/(utils)/StringUtil";
import { DietDay } from "@/app/(type)/diet";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React from "react";

function DietVerticalItem({dietDay, selectedDietDay, setSelectedDietDay}:{dietDay:DietDay, selectedDietDay:DietDay[], setSelectedDietDay:(dietDay:DietDay[])=>void}){


    return (
        <div className="h-[170px] w-[170px] flex flex-col p-3 m-2 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
                <div className="text-center">
                    <h2>{dietDay?.title&&truncateString(dietDay.title, 8)}</h2>
                </div>
                <div>
                    <CalendarMonthIcon sx={{ width: 15, height: 15 }} className='me-1'/>
                    <span className='text-[12px]'>{extractDate(dietDay.createdAt as string)}</span>
                </div>
                <div className="h-full text-start mt-1 top-line">
                    {dietDay?.memo && truncateString(dietDay?.memo, 25)}
                </div>
        </div>
    )
}

export default React.memo(DietVerticalItem);
