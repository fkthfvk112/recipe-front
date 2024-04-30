"use client"

import Image from "next/image";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { DietItem, DietItemRow } from "@/app/(type)/diet";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, Box, Modal } from "@mui/material";


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

interface DietDayRowProp{
    title:string;
    dietItemRow:DietItemRow;
}

function DietDayBox({title, dietItemRow}:DietDayRowProp){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const getImg = (inx:number)=>{
        const itemNow:DietItem = dietItemRow.dietItemList[inx];
        if(itemNow?.photo === undefined || itemNow.photo === ""){
            return <Avatar className="w-16 h-16" />
        }
        return (
                <Image
                className="rounded-full"
                width={64}
                height={64}
                src={itemNow.photo as string}
                alt="no img">
                </Image>
        )
      }
    
    const itemBageList = dietItemRow?.dietItemList.map((dietItem, inx)=>{
        return(
            <div>
                <div className="w-full flex justify-end">
                </div>
                <div className="grid grid-cols-4 mb-8 " key={inx}>
                    <div className="col-span-1">
                    <div className="p-1">
                        <div>이미지</div>
                    </div>
                    </div>
                    <div className="col-span-3">
                        <div className="flex justify-between">
                            <div>{dietItem.title}</div>
                            <div>{dietItem.calorie}</div>
                        </div>
                        <div className="grid grid-cols-3 mb-3">
                            <div className="col-span-1">{dietItem.qqt}</div>
                            <div className="col-span-2 bg-slate-200 p-2 rounded-lg">{dietItem.memo}</div>
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
        )
    })

    console.log("아이템", dietItemRow);

    return (
        <div className="flex flex-col justify-start items-center bg-slate-200 w-52 h-52 p-3 m-3">
            <div className="flex justify-between w-full">
                <div className="w-full mt-2 font-bold">
                    {title}
                </div>
                <div onClick={()=>{setIsModalOpen(true)}}>
                    <ZoomInIcon></ZoomInIcon>
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-start text-sm">
                {dietItemRow.dietItemList?.map((item, inx)=>{
                    return (
                        <span key={inx} className="flex justify-center items-center bg-white m-1 border border-1 rounded-md ps-2 pe-2 pt-0.5 pb-0.5">{item.title}</span>
                    )
                })}
            </div>

            <Modal
                open={isModalOpen}
                onClose={() => {
                setIsModalOpen(false);
                }}
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1>{title}</h1>
                    <div className="text-center">
                    </div>
                    {itemBageList}
                </Box>
            </Modal>
        </div>
    )
}

export default React.memo(DietDayBox);