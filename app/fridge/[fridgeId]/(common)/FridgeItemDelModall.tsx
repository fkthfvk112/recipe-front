"use client"

import React, { use, useEffect, useState } from "react";
import { FridgeIdNameDesc, FridgeItem } from "../../../(type)/fridge";
import { Box, LinearProgress, Modal, Slider } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeDelModalOpenState } from "@/app/(recoil)/fridgeAtom";
import { useQueryClient } from "@tanstack/react-query";

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

function FridgeItemDelModal({fridgeItem, fridgeId, }:{fridgeItem:FridgeItem, fridgeId:number}){
    const [open, setOpen] = useRecoilState<boolean>(fridgeDelModalOpenState);
    const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [qqt, setQqt] = useState<number>(0)
    const [imgUrl, setImgUrl] = useState<string>(fridgeItem.imgUrl)

    const [progressVal, setProgressVal] = useState<number>(1);

    const onProgressChange = (value: number) => {
        setProgressVal(value);
        console.log("progress changed:", value);
    };

    // LinearProgress는 0~100 기준이라 안전 보정
    const normalise = (value: number) => {
        if (value < 1) return 1;
        if (value > 100) return 100;
        return value;
    };

    const qc = useQueryClient();

    return(
        <>
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                    <ClearIcon/>
                </div>
                <div className="text-center">
                    <section className="flex-col mt-2 mb-8 w-full relative">
                        <h2 className="mb-3">식재료 폐기</h2>
                        <div className="w-full flex justify-between items-center">
                            <div className="text-start">
                                <h2>식재료명</h2>
                                <p>{fridgeItem.name}</p>
                            </div>
                            <div onClick={()=>setImgModalOpen(true)} className="w-[100px] h-[100px] img-wrapper-square bg-[#e1e1e1] rounded-2xl">
                                <Image className="inner-img-whole" src={imgUrl}  alt="ex" fill={true} quality={100}/>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col justify-start items-center">
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>수량</h2>
                            <input className="w-[150px]" onChange={(evt)=>{setQqt(Number(evt.target.value))}} value={qqt} type="number" />
                        </div>
                        <div className="h-16 w-full">
                            <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
                            {/* Progress Bar */}
                            <LinearProgress
                                variant="determinate"
                                value={qqt}
                                sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "red",
                                },
                                }}
                            />

                            {/* Slider (thumb only) */}
                            <Slider
                                value={qqt}
                                onChange={(_, v) => setQqt(v as number)}
                                min={0}
                                max={100}
                                sx={{
                                position: "absolute",
                                top: 0, // 중앙 정렬
                                left: 0,
                                width: "100%",
                                height: 10,
                                padding: 0,
                                "& .MuiSlider-rail": { opacity: 0 },
                                "& .MuiSlider-track": { opacity: 0 },
                                "& .MuiSlider-thumb": {
                                    width: 20,
                                    height: 20,
                                    backgroundColor: "red",
                                    boxShadow: "0 0 0 4px rgba(76,175,80,0.2)",
                                },
                                }}
                            />
                            </Box>
                        </div>
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>가격</h2>
                            <input className="w-[150px]" value={price} onChange={(evt)=>{setPrice(Number(evt.target.value))}} type="number" />
                        </div>
                        <div className="w-full text-start mt-3">
                            <h2>메모</h2>
                            <textarea value={description} onChange={(evt)=>{setDescription(evt.target.value)}} className="p-1" name="" id="" maxLength={100}/>
                        </div>
                        <div className="w-full flex gap-1">
                            <button className={`w-full deadBtn`}>폐기하기</button>
                        </div>
                    </section>
                </div>
            </Box>
        </Modal>
        </>
    )
}

export default React.memo(FridgeItemDelModal);