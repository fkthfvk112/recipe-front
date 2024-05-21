"use client"

import Image from "next/image";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { DietItem, DietItemRow } from "@/app/(type)/diet";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, Box, Modal } from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

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
    backgroundColor:'#003c80',
    color:"white",
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
                    <div className="col-span-1 pt-1">
                        {/* have to :: edit 1. 사진 없을 때 대체 사진, 2 사진 둥글게 만들기 */}
                        <div className="img-wrapper-round">
                        {dietItem?.photo?
                            <Image width={70}
                                    height={70}
                                    src={dietItem?.photo}
                                    alt="no img"/>
                            :
                            <RestaurantMenuIcon className="inner-img"/>
                        }
                        </div>
                    </div>
                    <div className="col-span-3 ps-2">
                        <div className="flex justify-between">
                            <div className="white-title">{dietItem.title}</div>
                            <div>{dietItem.calorie}</div>
                        </div>
                        <div className="grid grid-cols-3 mb-3">
                            <div className="col-span-1">{dietItem.qqt}</div>
                            <div className="col-span-2 bg-[#94aece] p-2 rounded-lg text-black">{dietItem.memo}</div>
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="flex flex-col justify-start items-center bg-[#003c80] w-52 h-52 p-3 m-3 rounded-xl">
            <div className="flex justify-between w-full">
                <div className="w-full mt-2 font-bold text-white">
                    {title}
                </div>
                <div onClick={()=>{setIsModalOpen(true)}}>
                    <ZoomInIcon sx={{fill:'white', width:'2.5rem', height:'2.5rem'}}></ZoomInIcon>
                </div>
            </div>
            <div className="flex w-full flex-wrap text-sm">
                {dietItemRow.dietItemList?.map((item, inx)=>{
                    return (
                        <span key={inx} className="text-[#94aece] m-1 mt-2 text-[1.5em] font-bold">{item.title}</span>
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
                    <div className="w-full mb-3">
                        <h1>{title}</h1>
                    </div>
                    {itemBageList}
                </Box>
            </Modal>
        </div>
    )
}

export default React.memo(DietDayBox);