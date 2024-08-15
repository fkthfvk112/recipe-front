import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React from "react";
import Swal from 'sweetalert2';
import { DietDay } from '@/app/(type)/diet';
import { truncateString } from '@/app/(utils)/StringUtil';

function DietHoriItem({dietDay, selectedDietDay, setSelectedDietDay}:{dietDay:DietDay, selectedDietDay:DietDay[], setSelectedDietDay:(dietDay:DietDay[])=>void}){

    /**선택된 요소에 현재 요소가 있다면 삭제 후 true 리턴, 이외는 false */
    const delFromSelectedDiet = ()=>{
        if(selectedDietDay.some((ele)=>ele.dietDayId === dietDay.dietDayId)){

            setSelectedDietDay(selectedDietDay.filter((ele)=>ele.dietDayId !== dietDay.dietDayId));

            return true;
        }
        return false;
    }


    /**현재 아이템을 선택된 아이템으로 변환, 선택된 아이템의 최대 수는 5*/
    const hadleSelectDiet = ()=>{
        if(delFromSelectedDiet()){
            return;
        }

        if(selectedDietDay.length >= 3){
            Swal.fire({
                title:"더 이상 추가할 수 없습니다.",
                text:"식단은 최대 3개까지 선택 가능해요."
            }).then((result)=>{
                if(result.isConfirmed){
                    return;
                }
            })
        }
        else{
            setSelectedDietDay([...selectedDietDay, dietDay]);
        }
    };

    console.log()

    return (
        <div onClick={()=>{hadleSelectDiet()}} className="w-full h-[120px] grid grid-cols-7 mt-2 p-3 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <div className="col-span-3 flex flex-col justify-center items-start">
                <div className='ms-2'>
                    <h2>{dietDay?.title&&truncateString(dietDay.title, 10)}</h2>
                </div>
                <div>
                    <CalendarMonthIcon sx={{ width: 15, height: 15 }} className='me-1'/>
                    <span className='text-[12px]'>{dietDay.dietDate}</span>
                </div>
            </div>
            <div className="col-span-4 flex flex-col">
                <div className="p-1 ps-2 pe-2 h-full left-line text-start">
                    {dietDay?.memo&&truncateString(dietDay.memo, 25)}
                </div>
            </div>
        </div>
    )
}

export default React.memo(DietHoriItem);