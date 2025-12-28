"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { useScroll } from "framer-motion";
import { FrdgePresetItemPreview, FridgePresetPreview } from "../(type)/fridgePreset";
import Image from "next/image";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FridgePresetPickerProp{
    selectedPresetId:number;
    setSelectedPresetId: Dispatch<SetStateAction<number>>
}

export default function FridgePresetPicker({selectedPresetId, setSelectedPresetId}:FridgePresetPickerProp){
    const [presetList, setPresetList] = useState<FridgePresetPreview[]>()

    useEffect(() => {
        axiosAuthInstacne.get("/fridge/preset/list?presetSort=BASIC").then((res) => {
            setPresetList(res.data ?? []);
        });
    }, []);

    const clickPresetCard = (presetId:number)=>{
        if(selectedPresetId === presetId){
            setSelectedPresetId(-1);
            return;
        }else{
            setSelectedPresetId(presetId);
        }
    }
    
    const presetCompList = presetList?.map((preset)=>
        <div
            key={preset.fridgePresetId}
            className={`p-4 border rounded-lg shadow cursor-pointer hover:shadow-md bg-white w-full min-h-[200px] relative
                ${preset.fridgePresetId===selectedPresetId?"outline outline-4 outline-green-500":""}`}
                onClick={() => clickPresetCard(preset.fridgePresetId)}
            >
                {preset.fridgePresetId === selectedPresetId ? (
                <CheckCircleIcon
                sx={{
                    fontSize: 36,          // 아이콘 크기
                    color: "#22c55e",      // tailwind green-500
                }}
                className="absolute right-1 top-1"
                />) : (
                    <></>
                )}
            <section className="min-h-[120px]">
                <h1 className="mb-2 text-lg text-[#121212]">{preset.name}</h1>
                {preset.description && (
                <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {preset.description}
                </div>
                )}
            </section>
            {preset.items?.length ? (
                <Accordion
                disableGutters
                elevation={0}
                square
                sx={{
                    width: "100%",
                    "&:before": {
                    display: "none",
                    },
                }}
                >
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        sx={{
                        px: 0,
                        minHeight: "unset",
                        "&.Mui-expanded": { minHeight: "unset" },
                        "& .MuiAccordionSummary-content": {
                            margin: "8px 0",
                        },
                        }}
                    >
                        <p className="text-[#8a8a8a]">식재료 {preset.items.length}개 보기 </p>
                    </AccordionSummary>
                        <AccordionDetails
                        sx={{
                            p: 0,
                            m: 0,
                            width: "100%",
                        }}
                        >
                        <ul className="w-full flex-col justify-center items-center w-full">
                            {preset.items
                            .slice()
                            .sort((a:FrdgePresetItemPreview, b:FrdgePresetItemPreview) => a.sortOrder - b.sortOrder)
                            .map((it:FrdgePresetItemPreview) => (
                            <div
                                key={it.sortOrder}
                                className="border flex rounded-lg bg-[#fafafa] flex gap-3 items-center mt-3"
                            >
                                <div className="w-[35px] h-[35px] relative rounded-md overflow-hidden bg-white">
                                {it.imgUrl ? (
                                    <Image
                                    src={it.imgUrl as string}
                                    alt="img"
                                    fill
                                    sizes="35px"
                                    className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                    NO IMG
                                    </div>
                                )}
                                </div>
                                <div>
                                    {it.ingreName}
                                </div>
                            </div>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ) : (
                <div className="text-sm text-gray-600">
                등록된 아이템이 없습니다.
                </div>
            )}
        </div>)

    return(
        <div className="grid grid-cols-2 gap-3">
            {presetCompList}
        </div>
    )
}