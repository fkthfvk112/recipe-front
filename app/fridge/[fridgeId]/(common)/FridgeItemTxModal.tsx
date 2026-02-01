"use client"

import React, { use, useEffect, useState } from "react";
import { FridgeIdNameDesc, FridgeItem } from "../../../(type)/fridge";
import { Box, LinearProgress, Modal, Slider } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeTxModalOpenState } from "@/app/(recoil)/fridgeAtom";
import { useQueryClient } from "@tanstack/react-query";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import { TxType } from "./FridgeItemDetailModal";
import { formatNumber } from "@/app/(utils)/StringUtil";

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


export interface FridgeItemTx {
  fridgeItemId: number;
  txType: TxType;
  amt?: number;      // 금액 (선택)
  qqt: number;       // 처리 수량
  reason?: string;   // 사유 (선택)
}

function FridgeItemTxModal({fridgeItem, fridgeId, remainAmt, remainQqt, txType }:{
    fridgeItem:FridgeItem, remainAmt:number, remainQqt:number, fridgeId:number, txType:TxType}){

    const [open, setOpen] = useRecoilState<boolean>(fridgeTxModalOpenState);
    const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);
    const [reason, setReason] = useState<string>("");
    const [amt, setAmt] = useState<number>(0);
    const [qqt, setQqt] = useState<number>(0)
    const [imgUrl, setImgUrl] = useState<string>(fridgeItem.imgUrl)

    const qc = useQueryClient();

    const isDiscard = txType === "DISCARD";
    let typeKor = txType === "DISCARD"?"폐기":"소비";
    

    useEffect(() => {
        if (!open) return;

        setReason("");
        setAmt(0);
        setQqt(0);
    }, [open]);
    // 개당 가격

    const maxQqt = remainQqt;
    const progressValue = maxQqt > 0 ? (qqt / maxQqt) * 100 : 0;

    const calculNSetAmt = (qqt: number) => {
        setQqt(qqt)
        if (!fridgeItem) {
            setAmt(0);
            return;
        }

        const totalQqt = remainQqt;
        const totalAmt = remainAmt;
        if (totalQqt <= 0 || qqt <= 0) {
            setAmt(0);
            return;
        }
        if (qqt >= totalQqt) {
            setAmt(totalAmt);
            return;
        }
        const oneUnitAmt = totalAmt / totalQqt;
        
        setAmt(Math.round(oneUnitAmt * qqt));
    };

    const saveItemTx = ()=>{
        if(!fridgeItem?.fridgeImgId){
            return;
        }

        if ((qqt <= 0 && remainQqt != 0) || (amt < 0 && remainAmt != 0)) {
            Swal.fire({
                icon: "warning",
                text: "수량을 올바르게 입력해주세요.",
            });
            return;
        }

        Swal.fire({
            title: isDiscard
                ? "식재료를 폐기하시겠습니까?"
                : "식재료를 소비하시겠습니까?",
            text: isDiscard
                ? "폐기 후 되돌릴 수 없어요."
                : "소비 내역이 기록됩니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: isDiscard ? "폐기하기" : "소비하기",
            cancelButtonText: "취소",
            confirmButtonColor: isDiscard ? "#d33" : "#38c54b",
            }).then((result) => {
            if (result.isConfirmed) {
                const item:FridgeItemTx = {
                    fridgeItemId:fridgeItem.fridgeItemId!!,
                    txType:txType,
                    amt:amt,
                    qqt:qqt,
                    reason:reason
                }

                axiosAuthInstacne.post("fridge/my/fridge-item/tx", item).then((res)=>{
                    if(res.data === 'CREATE_SUCCESS'){
                        Swal.fire({
                            title: isDiscard
                            ? "식재료가 폐기되었습니다."
                            : "식재료가 소비되었습니다.",
                            icon: "success",
                        })
                        setOpen(false);
                        qc.invalidateQueries({
                            queryKey: ["fridgeDetail", fridgeId],
                        });
                        qc.invalidateQueries({
                            queryKey:  ["fridgeItemDetail", fridgeItem.fridgeItemId!!],
                        });  
                    }
                })
            }})
    }

    const selectAll = () => {
      calculNSetAmt(remainQqt);
    };

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
                        <h2 className="mb-3">
                        {txType === "DISCARD" ? "식재료 폐기" : "식재료 소비"}
                        </h2>
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
                            <h2>{typeKor} 수량</h2>
                            <div className="flex gap-3 items-center">
                                <input className="w-[150px]"   
                                onChange={(evt) => {
                                    const value = Number(evt.target.value);
                                    const max = remainQqt;

                                    if (value > max) {
                                    calculNSetAmt(max);
                                    } else if (value < 0) {
                                    calculNSetAmt(0);
                                    } else {
                                    calculNSetAmt(value);
                                    }
                                }}
                                value={qqt} type="number" max={remainQqt} />
                                <span className="text-lg text-[#121212]">{fridgeItem.unit??""}</span>
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-center text-xs">
                        <div>
                            최대 {typeKor} 가능 수량
                            <span
                            className={`text-base ms-1 ${
                                isDiscard ? "text-red-500" : "text-[#31853c]"
                            }`}
                            >
                            {formatNumber(remainQqt)}
                            </span>
                            {fridgeItem.unit ?? ""}
                        </div>

                        <button
                            type="button"
                            onClick={selectAll}
                            className="saveBtn-outline-green p-1"
                        >
                            전체 선택
                        </button>
                        </div>
                        
                        <div className="flex relative h-16 w-full">
                            <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progressValue}
                                sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: isDiscard ? "#fa5757" : "#38c54b",
                                },
                                }}
                            />
                            <Slider
                                value={qqt}
                                onChange={(_, v) => calculNSetAmt(v as number)}
                                min={0}
                                max={remainQqt}
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
                                    backgroundColor: isDiscard ? "#f38989" : "#38c54b",
                                    boxShadow: "0 0 0 4px rgba(76,175,80,0.2)",
                                },
                                }}
                            />
                            </Box>
                        </div>
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>{typeKor} 금액</h2>
                            <input className="w-[150px]" value={amt} onChange={(evt)=>{
                                const value = Number(evt.target.value);
                                const max = remainAmt;
                                if (value > max) {
                                    setAmt(max);
                                } else if (value < 0) {
                                    setAmt(0);
                                } else {
                                    setAmt(value);
                                }
                            }} type="number" />
                        </div>
                        <div className="w-full text-start text-xs">
                        최대 {typeKor} 가능 금액{" "}
                        <span className={`text-base ${isDiscard ? "text-red-600" : "text-[#31853c]"}`}>
                            {formatNumber(remainAmt)}
                        </span>
                        원
                        </div>
                        <hr className="w-full mt-3 mb-3" />
                        <div className="w-full text-start mt-3">
                            <h2>메모</h2>
                            <textarea value={reason} onChange={(evt)=>{setReason(evt.target.value)}} className="p-1" name="" id="" maxLength={100}/>
                        </div>
                        <div className="w-full flex gap-1">
                            <button onClick={()=>{saveItemTx()}} className={`w-full ${isDiscard?"grayBtn":"greenBtn"}`}>
                                {isDiscard
                                ? "폐기하기"
                                : "소비하기"
                                }
                            </button>
                        </div>
                        <p className="my-3 text-xs text-start">*전체 수량 {typeKor} 시 냉장고에서 식재료가 사라집니다.</p>
                    </section>
                </div>
            </Box>
        </Modal>
        </>
    )
}

export default React.memo(FridgeItemTxModal);