import { Box, Modal } from "@mui/material";
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

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

function DietFinderModal({dietDay, setDietDay}:{dietDay:DietDay[], setDietDay:(dietDay:DietDay[])=>void}){
    const [open, setOpen] = useState<boolean>(false);
    const [searchedDietDay, setSearchedDietDay] = useState<DietDay[]>([]);

    useEffect(()=>{
        axiosAuthInstacne
        .get(`diet/day/my-days`)
        .then((res) => {
            console.log("히", res.data);
            setSearchedDietDay(res.data);
        })
        .catch((err) => {
            console.log("아시오스 에러", err);
        });
    }, [])

    console.log("다이어트", dietDay);


    const deleteDiet = (inx:number)=>{
        const deletedDiet = dietDay.filter((_, index) => index !== inx);
        setDietDay(deletedDiet);
    };


    /**모달 내 선택 가능한 아이템(검색된 아이템) */
    const searchedRecipeComps = searchedDietDay?.filter((ele) => {
        return !dietDay.some((selected) => selected.dietDayId === ele.dietDayId);
      }).map((ele, inx) =>
        <DietHoriItem key={inx} dietDay={ele} selectedDietDay={dietDay} setSelectedDietDay={setDietDay}/>
      );
      
      console.log("선택 가능", searchedDietDay)

      /**모달 내 선택된 아이템 */
    const selectedRecipeComps = dietDay.map((ele, inx)=>
        <DietHoriItem key={inx} dietDay={ele} selectedDietDay={dietDay} setSelectedDietDay={setDietDay}/>
)

    /**선택 미리보기 */
    const selectedRecipeCardComps = dietDay.map((ele, inx)=>
        <div className="relative" onClick={()=>setOpen(true)}>
                <div className="w-full text-right">
                    <button onClick={(evt)=>{
                        deleteDiet(inx);
                        evt.stopPropagation();
                        }} className="border-none w-5 h-5 mr-2 absolute top-0 right-3 z-50">
                        <ClearIcon/>
                    </button>
                </div> 
            <DietVerticalItem key={inx} dietDay={ele}/>
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
                <div className="text-center">
                    <div className="flex justify-center items-center">
                        <h2>선택된 식단</h2>
                        <Tooltip className="ml-2" title="레시피를 클릭하여 제거" arrow>
                            <HelpOutlineIcon/>
                        </Tooltip>
                    </div>
                    <div className="w-full min-h-16 max-h-72 overflow-y-scroll">
                        {selectedRecipeComps}
                    </div>
                    <div className="w-full max-h-72 flex flex-col justify-start items-center">
                        <div className="flex mt-2 mb-2 w-full relative">
                            가르기
                        </div>
                        <div className="flex justify-center items-center">
                            <h2>검색된 식단</h2>
                            <Tooltip className="ml-2" title="레시피를 클릭하여 추가" arrow>
                                <HelpOutlineIcon/>
                            </Tooltip>
                        </div>
                        <div className="w-full h-72 overflow-y-scroll">
                            {searchedRecipeComps}
                        </div>
                    </div>
                </div>
                </Box>
            </Modal>
        </div>
    )
    
}

export default React.memo(DietFinderModal);