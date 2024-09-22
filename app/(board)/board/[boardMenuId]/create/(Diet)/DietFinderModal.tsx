import { Box, CircularProgress, Modal } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DietDay } from "@/app/(type)/diet";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import DietHoriItem from "./DietHoriItem";
import DietVerticalItem from "./DietVerticalItem";
import ClearIcon from '@mui/icons-material/Clear';
import DietSquareItem from "./DietSquareItem";
import { useInView } from "react-intersection-observer";
import { IndexPagenation } from "@/app/(type)/Pagenation";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:450,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

function DietFinderModal({dietDay, setDietDay}:{dietDay:DietDay[], setDietDay:(dietDay:DietDay[])=>void}){
    const [open, setOpen] = useState<boolean>(false);
    const [searchedDietDay, setSearchedDietDay] = useState<IndexPagenation<DietDay[], string>>({
        isEnd:false,
        index:"",
        data:[]
    });
    const [viewRef, inview] = useInView();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(isLoading) return;
        if(inview && !searchedDietDay.isEnd){
            setIsLoading(true);
            axiosAuthInstacne.get("diet/day/my-days/inx-pagination", { 
                params:{
                    dateInx:searchedDietDay?.index,
                    size:10
                }
            }).then((res)=>{
                setSearchedDietDay(prev=>({
                    isEnd:res.data.isEnd,
                    index:res.data.index,
                    data:[...prev.data, ...res.data.data]
                }));
            }).catch((err)=>{
                setSearchedDietDay(prev=>({
                    ...prev,
                    isEnd:true,
                }));
            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
    }, [inview, isLoading])

    const deleteDiet = (inx:number)=>{
        const deletedDiet = dietDay.filter((_, index) => index !== inx);
        setDietDay(deletedDiet);
    };


    /**모달 내 선택 가능한 아이템(검색된 아이템) */
    const searchedRecipeComps = searchedDietDay?.data.filter((ele) => {
        return !dietDay.some((selected) => selected.dietDayId === ele.dietDayId);
      }).map((ele, inx) =>
        <DietHoriItem key={inx} dietDay={ele} selectedDietDay={dietDay} setSelectedDietDay={setDietDay}/>
      );
      
      /**모달 내 선택된 아이템 */
    const selectedDietComps = dietDay.map((ele, inx)=>
            <span key={inx} className="flex justify-center items-center w-fit pe-8 bg-[#a1a1a1]  m-1 mt-2 text-white ps-1.5 rounded-md font-bold whitespace-nowrap relative">
        <div onClick={()=>delFromSelectedDiet(ele)} className="cursor-pointer absolute right-0">
            <ClearIcon/>
        </div>
        {ele.title}
    </span>
    )

    const delFromSelectedDiet = (clickedDiet:DietDay)=>{
        if(dietDay.some((ele)=>ele.dietDayId === clickedDiet.dietDayId)){
            setDietDay(dietDay.filter((ele)=>ele.dietDayId !== clickedDiet.dietDayId));
            return true;
        }
        return false;
    }

    /**선택 미리보기 */
    const selectedRecipeCardComps = dietDay.map((ele, inx)=>
        <div key={inx} className="relative" onClick={()=>setOpen(true)}>
                <div className="w-full text-right">
                    <button onClick={(evt)=>{
                        deleteDiet(inx);
                        evt.stopPropagation();
                        }} className="border-none w-5 h-5 mr-2 absolute top-0 right-3 z-50">
                        <ClearIcon/>
                    </button>
                </div> 
                <ul className="w-[150px] h-[150px] m-1">
                    <DietSquareItem key={inx} dietDay={ele}/>
                </ul>
        </div>)

    return(
        <div className="w-full flex justify-start items-center overflow-x-scroll">
            {selectedRecipeCardComps}
            {
            dietDay.length < 3 &&
            <button className="flex justify-center items-center border-[#d1d1d1] w-20 h-20 m-3" onClick={()=>setOpen(true)}>
                <AddIcon sx={{fill:'black', width:'2.5rem', height:'2.5rem'}}/>
            </button>
            }
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                        <ClearIcon/>
                    </div>
                    <div className="text-center">
                        <section className="flex-col mt-2 mb-8 w-full relative">
                            <div className="w-full text-start">
                                <h2>식단</h2>
                            </div>
                            <div className="flex flex-wrap">
                                {selectedDietComps}
                            </div>
                        </section>
                        <div className="w-full flex justify-start items-center">
                            <h2>내 식단</h2>
                            <Tooltip className="ml-2 mb-1" title="식단을 클릭하여 추가" arrow>
                                <HelpOutlineIcon/>
                            </Tooltip>
                        </div>
                        <section className="w-full h-80 overflow-y-scroll">
                            {searchedRecipeComps}
                            {isLoading && <CircularProgress className="mt-[100px]"/>}
                            <div ref={viewRef}></div>
                        </section>
                    </div>
                </Box>
            </Modal>
        </div>
    )
    
}

export default React.memo(DietFinderModal);