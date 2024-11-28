"use client"

import Image from "next/image";
import { DietItemRow } from "@/app/(type)/diet";
import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    height:600,
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 400,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

interface DietDayRowProp{
    title:string;
    dietItemRow:DietItemRow;
}

function DietDayBox({title, dietItemRow}:DietDayRowProp){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const itemBageList = dietItemRow?.dietItemList.map((dietItem, inx)=>{
        return(
            <div key={inx} className="flex flex-col justify-center items-center p-3 bottom-line pb-10 relative">
                <div className="w-full flex flex-col">
                    <h2>{dietItem.title}</h2>
                </div>
                <div className="w-full flex flex-col">
                    {
                    dietItem?.memo&&
                    <div className="bg-[#e1e1e1] mt-3 img-wrapper-square p-2 rounded-lg whitespace-pre-wrap">
                        {dietItem.memo}
                    </div>
                    }
                </div>
                <div className="w-full mt-3 grid grid-cols-2">
                    <div className="col-span-1">
                        <div>{dietItem?.qqt}</div>
                    </div>
                    <div className="col-span-1 relative">
                    {
                        dietItem?.calorie && dietItem?.calorie > 0 ? (
                            <div>{dietItem.calorie}<span className="font-bold text-[#5a5a5a]"> kcal</span></div>
                        ) : null
                    }
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="flex flex-col justify-start items-center border-2 rounded-xl min-h-[208px] p-3 mt-2">
            <div className="flex-center-col w-full bottom-line">
                <div className="w-full mb-2 font-bold text-xl flex justify-between">
                    {title}
                    <div onClick={()=>{setIsModalOpen(true)}}>
                        <button className="font-normal text-sm border-none p-0 m-0 w-20 greenBtn">음식 상세</button>
                    </div>
                </div>
            </div>
            {
                dietItemRow?.photo&&
                <div className="w-full flex-center">
                    <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] mt-3 img-wrapper-square">
                        <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] img-wrapper-square">
                            <Image src={dietItemRow.photo} alt="no img" fill/>
                        </div>
                    </div>
                </div>
            }
            <div className="flex w-full flex-wrap text-sm">
                {dietItemRow.dietItemList?.map((item, inx)=>{
                    return (
                        <span key={inx} className="bg-[#a1a1a1]  m-1 mt-2 text-white ps-1.5 pe-1.5 rounded-md font-bold">{item.title}</span>
                    )
                })}
            </div>
            
            <Modal
                open={isModalOpen}
                onClose={() => {
                setIsModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className="w-full relative">
                        <h1 className="m-2 mb-2 text-2xl">{title}</h1>
                        <button onClick={()=>setIsModalOpen(false)} className="closeBtnParent">
                            <CloseIcon/>
                        </button>
                    </div>
                    <div className="bottom-line"/>
                    <div className="p-3 min-h-[500px] max-h-[500px] overflow-y-scroll">
                        {
                            dietItemRow?.photo&&
                            <div className="w-full flex-center">
                                <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] mt-3 img-wrapper-square">
                                    <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] img-wrapper-square">
                                        <Image src={dietItemRow.photo} alt="no img" fill/>
                                    </div>
                                </div>
                            </div>
                        }
                        {itemBageList}
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default React.memo(DietDayBox);